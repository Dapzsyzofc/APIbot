const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const router = express.Router();
const adapter = new FileSync(path.join(__dirname, '..', 'db.json'));
const db = low(adapter);

// Initialize default admin
db.defaults({
    apis: [],
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10),
    }
}).write();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = db.get('admin').value();

    if (username !== admin.username) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
        { username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        message: 'Login successful',
        token,
        user: { username: admin.username, role: 'admin' },
    });
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false });
    }
    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;
