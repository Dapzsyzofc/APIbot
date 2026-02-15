const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

// ─── Embed initial data via require() ────────────────────
// ncc bundles require()'d JSON inline, so it works in serverless
let initialData;
try {
    initialData = require('../db.json');
} catch {
    initialData = { apis: [], apikeys: [], settings: {}, admin: {} };
}

/**
 * Get the correct db.json path.
 * On Vercel: write embedded data to /tmp/db.json (writable).
 * Locally:   use project root db.json.
 */
const getDbPath = () => {
    if (process.env.VERCEL) {
        const tmpPath = '/tmp/db.json';
        if (!fs.existsSync(tmpPath)) {
            fs.writeFileSync(tmpPath, JSON.stringify(initialData, null, 2));
        }
        return tmpPath;
    }
    return path.join(__dirname, '..', 'db.json');
};

/**
 * Create a fresh lowdb instance.
 */
const getDb = () => {
    const adapter = new FileSync(getDbPath());
    return low(adapter);
};

module.exports = { getDb };
