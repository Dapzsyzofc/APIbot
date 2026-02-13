const { getDb } = require('../db');

const apikeyMiddleware = (req, res, next) => {
    const db = getDb();

    const apiId = req.params.id;
    const api = db.get('apis').find({ id: apiId }).value();

    if (!api) {
        return res.status(404).json({ error: 'API not found.' });
    }

    if (!api.isActive) {
        return res.status(503).json({ error: 'This API is currently disabled.' });
    }

    // Check requiresKey — validate against apikeys collection
    if (api.requiresKey) {
        const providedKey = req.query.apikey || req.headers['x-api-key'];
        if (!providedKey) {
            return res.status(401).json({
                error: 'API key required.',
                message: 'Please provide ?apikey=YOUR_KEY or X-API-Key header.',
            });
        }

        // Look up in centralized apikeys collection
        const keyRecord = db.get('apikeys').find({ key: providedKey }).value();
        if (!keyRecord) {
            return res.status(403).json({ error: 'Invalid API key.' });
        }
        if (!keyRecord.isActive) {
            return res.status(403).json({ error: 'API key is disabled. Contact admin.' });
        }

        req.apiKeyData = keyRecord;
    }

    req.apiData = api;
    next();
};

module.exports = apikeyMiddleware;
