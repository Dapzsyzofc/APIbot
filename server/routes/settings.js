const express = require('express');
const authMiddleware = require('../middleware/auth');
const { getDb } = require('../db');

const router = express.Router();

// GET /api/settings - Public: get site settings
router.get('/', (req, res) => {
    const db = getDb();
    const settings = db.get('settings').value();
    if (!settings || Object.keys(settings).length === 0) {
        return res.json({
            heroTitle: 'API DapzSYZ',
            heroSubtitle: 'for Bot Integration',
            heroDescription: 'Platform lengkap untuk mengelola, mendokumentasikan, dan menguji API WhatsApp & Telegram Bot.',
            footerText: 'Made with ❤️ by DapzSYZ',
            footerMotto: 'Platform API Documentation untuk Bot WhatsApp & Telegram.',
            socials: {
                whatsapp: { url: '', enabled: true },
                github: { url: '', enabled: true },
                instagram: { url: '', enabled: true },
            },
        });
    }
    res.json(settings);
});

// PUT /api/settings - Admin: update site settings
router.put('/', authMiddleware, (req, res) => {
    const { heroTitle, heroSubtitle, heroDescription, footerText, footerMotto, socials } = req.body;

    const updates = {};
    if (heroTitle !== undefined) updates.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) updates.heroSubtitle = heroSubtitle;
    if (heroDescription !== undefined) updates.heroDescription = heroDescription;
    if (footerText !== undefined) updates.footerText = footerText;
    if (footerMotto !== undefined) updates.footerMotto = footerMotto;
    if (socials !== undefined) updates.socials = socials;

    const db = getDb();
    const current = db.get('settings').value() || {};
    db.set('settings', { ...current, ...updates }).write();

    res.json(db.get('settings').value());
});

module.exports = router;
