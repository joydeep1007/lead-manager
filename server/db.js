const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const rawDbPath = process.env.DB_PATH || './data/leads.db';
const dbPath = rawDbPath === ':memory:' ? ':memory:' : path.resolve(__dirname, rawDbPath);

if (dbPath !== ':memory:') {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS leads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER REFERENCES users(id),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT,
    company    TEXT,
    source     TEXT NOT NULL,
    status     TEXT NOT NULL DEFAULT 'New',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_name   ON leads(name);
`);

const leadColumns = db.prepare("PRAGMA table_info('leads')").all();
if (!leadColumns.some((col) => col.name === 'user_id')) {
  db.exec('ALTER TABLE leads ADD COLUMN user_id INTEGER REFERENCES users(id)');
}
db.exec('CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id)');

module.exports = db;
