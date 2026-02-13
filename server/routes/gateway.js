const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const apikeyMiddleware = require('../middleware/apikey');

const router = express.Router();
const HANDLERS_DIR = path.join(__dirname, '..', 'handlers');

// Multer setup for file uploads (stored in memory for handlers)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// GET/POST /api/gateway/:id - Route through gateway (proxy or local handler)
router.all('/:id', upload.single('file'), apikeyMiddleware, async (req, res) => {
    const api = req.apiData;

    try {
        // ======== LOCAL HANDLER ========
        if (api.apiType === 'local') {
            const handlerName = api.handlerFile || api.name.toLowerCase().replace(/\s+/g, '-');
            const handlerPath = path.join(HANDLERS_DIR, `${handlerName}.js`);

            if (!fs.existsSync(handlerPath)) {
                return res.status(501).json({
                    error: 'Local handler not found.',
                    handler: handlerName,
                    message: `File "${handlerName}.js" not found in /handlers directory.`,
                });
            }

            // Clear require cache for hot-reload during development
            delete require.cache[require.resolve(handlerPath)];
            const handler = require(handlerPath);

            if (typeof handler !== 'function') {
                return res.status(500).json({
                    error: 'Invalid handler.',
                    message: `Handler "${handlerName}.js" must export a function(req, res).`,
                });
            }

            return handler(req, res);
        }

        // ======== PROXY ========
        const queryParams = { ...req.query };
        delete queryParams.apikey;

        const config = {
            method: api.method || 'GET',
            url: api.endpoint,
            params: queryParams,
            headers: {
                'User-Agent': 'API-DapzSYZ/1.0',
            },
            timeout: 30000,
        };

        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            config.data = req.body;
        }

        // Forward file if present
        if (req.file) {
            const FormData = require('form-data');
            const formData = new FormData();
            formData.append('file', req.file.buffer, req.file.originalname);
            // Add other body fields
            Object.entries(req.body || {}).forEach(([key, val]) => {
                formData.append(key, val);
            });
            config.data = formData;
            config.headers = { ...config.headers, ...formData.getHeaders() };
        }

        const response = await axios(config);
        res.status(response.status).json(response.data);

    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({
                error: 'Upstream API error',
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.code === 'ECONNABORTED') {
            res.status(504).json({ error: 'Gateway timeout. The upstream API did not respond in time.' });
        } else {
            res.status(502).json({
                error: 'Bad gateway. Could not reach the upstream API.',
                details: error.message,
            });
        }
    }
});

module.exports = router;
