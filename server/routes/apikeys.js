const express = require('express');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const crypto = require('crypto');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'db.json');

const generateKey = () => 'ak_' + crypto.randomBytes(24).toString('hex');

// Helper: fresh db read
const getDb = () => {
    const adapter = new FileSync(dbPath);
    return low(adapter);
};

// GET /api/apikeys — list all keys (admin)
router.get('/', authMiddleware, (req, res) => {
    const db = getDb();
    db.defaults({ apikeys: [] }).write();
    const keys = db.get('apikeys').value();
    res.json(keys);
});

// GET /api/apikeys/stats — key stats (admin)
router.get('/stats', authMiddleware, (req, res) => {
    const db = getDb();
    db.defaults({ apikeys: [] }).write();
    const keys = db.get('apikeys').value();
    res.json({
        total: keys.length,
        active: keys.filter(k => k.isActive).length,
        disabled: keys.filter(k => !k.isActive).length,
    });
});

// POST /api/apikeys — create new key (admin)
router.post('/', authMiddleware, (req, res) => {
    const { owner } = req.body;
    if (!owner || !owner.trim()) {
        return res.status(400).json({ error: 'Owner name is required.' });
    }

    const db = getDb();
    db.defaults({ apikeys: [] }).write();

    const newKey = {
        id: uuidv4(),
        key: generateKey(),
        owner: owner.trim(),
        isActive: true,
        createdAt: new Date().toISOString(),
    };

    db.get('apikeys').push(newKey).write();
    res.status(201).json(newKey);
});

// PATCH /api/apikeys/:id/toggle — enable/disable key (admin)
router.patch('/:id/toggle', authMiddleware, (req, res) => {
    const db = getDb();
    db.defaults({ apikeys: [] }).write();

    const key = db.get('apikeys').find({ id: req.params.id }).value();
    if (!key) {
        return res.status(404).json({ error: 'API key not found.' });
    }

    db.get('apikeys').find({ id: req.params.id }).assign({
        isActive: !key.isActive,
    }).write();

    const updated = db.get('apikeys').find({ id: req.params.id }).value();
    res.json(updated);
});

// DELETE /api/apikeys/:id — delete key (admin)
router.delete('/:id', authMiddleware, (req, res) => {
    const db = getDb();
    db.defaults({ apikeys: [] }).write();

    const key = db.get('apikeys').find({ id: req.params.id }).value();
    if (!key) {
        return res.status(404).json({ error: 'API key not found.' });
    }

    db.get('apikeys').remove({ id: req.params.id }).write();
    res.json({ message: 'API key deleted successfully.' });
});

module.exports = router;
