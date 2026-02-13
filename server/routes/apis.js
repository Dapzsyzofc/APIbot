const express = require('express');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();
const adapter = new FileSync(path.join(__dirname, '..', 'db.json'));
const db = low(adapter);

const generateApiKey = () => {
    return 'ak_' + crypto.randomBytes(20).toString('hex');
};

// GET /api/manage/apis - Public: list all APIs
router.get('/apis', (req, res) => {
    const apis = db.get('apis').value();
    const publicApis = apis.map(({ apiKey, ...rest }) => ({
        ...rest,
        hasKey: !!apiKey,
    }));
    res.json(publicApis);
});

// GET /api/manage/apis/admin - Admin: list all APIs with full data
router.get('/apis/admin', authMiddleware, (req, res) => {
    const apis = db.get('apis').value();
    res.json(apis);
});

// GET /api/manage/apis/:id - Public: get single API
router.get('/apis/:id', (req, res) => {
    const api = db.get('apis').find({ id: req.params.id }).value();
    if (!api) {
        return res.status(404).json({ error: 'API not found.' });
    }
    const { apiKey, ...publicApi } = api;
    res.json(publicApi);
});

// GET /api/manage/stats - Public: get statistics
router.get('/stats', (req, res) => {
    const apis = db.get('apis').value();
    const categories = [...new Set(apis.map(a => a.category))];
    res.json({
        totalApis: apis.length,
        activeApis: apis.filter(a => a.isActive).length,
        categories: categories.length,
        withKey: apis.filter(a => a.requiresKey).length,
        freeApis: apis.filter(a => !a.requiresKey).length,
        localHandlers: apis.filter(a => a.apiType === 'local').length,
        categoryList: categories,
    });
});

// GET /api/manage/categories - Public: get unique category list
router.get('/categories', (req, res) => {
    const apis = db.get('apis').value();
    const categories = [...new Set(apis.map(a => a.category))];
    res.json(categories);
});

// POST /api/manage/apis - Admin: create new API
router.post('/apis', authMiddleware, (req, res) => {
    const { name, endpoint, category, description, method, parameters, requiresKey, statusCodes, apiType, handlerFile } = req.body;

    if (!name || !category) {
        return res.status(400).json({ error: 'Name and category are required.' });
    }

    // For proxy type, endpoint is required
    if ((!apiType || apiType === 'proxy') && !endpoint) {
        return res.status(400).json({ error: 'Endpoint URL is required for proxy APIs.' });
    }

    const newApi = {
        id: uuidv4(),
        name,
        endpoint: endpoint || '',
        category,
        description: description || '',
        method: method || 'GET',
        parameters: parameters || [],
        statusCodes: statusCodes || [],
        requiresKey: requiresKey || false,
        apiKey: requiresKey ? generateApiKey() : null,
        apiType: apiType || 'proxy',
        handlerFile: handlerFile || '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    db.get('apis').push(newApi).write();
    res.status(201).json(newApi);
});

// PUT /api/manage/apis/:id - Admin: update API
router.put('/apis/:id', authMiddleware, (req, res) => {
    const api = db.get('apis').find({ id: req.params.id }).value();
    if (!api) {
        return res.status(404).json({ error: 'API not found.' });
    }

    const { name, endpoint, category, description, method, parameters, requiresKey, isActive, statusCodes, apiType, handlerFile } = req.body;

    const updates = {
        ...(name !== undefined && { name }),
        ...(endpoint !== undefined && { endpoint }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(method !== undefined && { method }),
        ...(parameters !== undefined && { parameters }),
        ...(statusCodes !== undefined && { statusCodes }),
        ...(isActive !== undefined && { isActive }),
        ...(apiType !== undefined && { apiType }),
        ...(handlerFile !== undefined && { handlerFile }),
        updatedAt: new Date().toISOString(),
    };

    if (requiresKey !== undefined) {
        updates.requiresKey = requiresKey;
        if (requiresKey && !api.apiKey) {
            updates.apiKey = generateApiKey();
        } else if (!requiresKey) {
            updates.apiKey = null;
        }
    }

    db.get('apis').find({ id: req.params.id }).assign(updates).write();
    const updated = db.get('apis').find({ id: req.params.id }).value();
    res.json(updated);
});

// PATCH /api/manage/apis/:id/toggle - Admin: toggle active/key
router.patch('/apis/:id/toggle', authMiddleware, (req, res) => {
    const api = db.get('apis').find({ id: req.params.id }).value();
    if (!api) {
        return res.status(404).json({ error: 'API not found.' });
    }

    const { field } = req.body;
    if (!['isActive', 'requiresKey'].includes(field)) {
        return res.status(400).json({ error: 'Field must be isActive or requiresKey.' });
    }

    const updates = {
        [field]: !api[field],
        updatedAt: new Date().toISOString(),
    };

    if (field === 'requiresKey') {
        if (!api.requiresKey && !api.apiKey) {
            updates.apiKey = generateApiKey();
        } else if (api.requiresKey) {
            updates.apiKey = null;
        }
    }

    db.get('apis').find({ id: req.params.id }).assign(updates).write();
    const updated = db.get('apis').find({ id: req.params.id }).value();
    res.json(updated);
});

// DELETE /api/manage/apis/:id - Admin: delete API
router.delete('/apis/:id', authMiddleware, (req, res) => {
    const api = db.get('apis').find({ id: req.params.id }).value();
    if (!api) {
        return res.status(404).json({ error: 'API not found.' });
    }

    db.get('apis').remove({ id: req.params.id }).write();
    res.json({ message: 'API deleted successfully.' });
});

module.exports = router;
