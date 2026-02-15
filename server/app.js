try { require('dotenv').config(); } catch { }

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/apis');
const gatewayRoutes = require('./routes/gateway');
const settingsRoutes = require('./routes/settings');
const apikeysRoutes = require('./routes/apikeys');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/manage', apiRoutes);
app.use('/api/gateway', gatewayRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/apikeys', apikeysRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Production: serve React build (local only, not Vercel) ─────
if (!process.env.VERCEL) {
    const distPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(distPath));

    // SPA fallback
    app.use((req, res, next) => {
        if (req.path.startsWith('/api/')) return next();
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

module.exports = app;
