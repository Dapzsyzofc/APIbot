const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');

/**
 * Get the correct db.json path.
 * On Vercel (read-only filesystem), copies db.json to /tmp on first use.
 */
const getDbPath = () => {
    if (process.env.VERCEL) {
        const tmpPath = '/tmp/db.json';
        if (!fs.existsSync(tmpPath)) {
            const srcPath = path.join(__dirname, '..', 'db.json');
            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, tmpPath);
            }
        }
        return tmpPath;
    }
    return path.join(__dirname, '..', 'db.json');
};

/**
 * Create a fresh lowdb instance (reads latest data from disk).
 */
const getDb = () => {
    const dbPath = getDbPath();
    const adapter = new FileSync(dbPath);
    const db = low(adapter);
    // defaults only fills in missing keys — no .write() to avoid overwriting seed data
    db.defaults({ apis: [], apikeys: [], settings: {}, admin: {} }).value();
    return db;
};

module.exports = { getDbPath, getDb };
