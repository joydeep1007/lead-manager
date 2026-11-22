# GitHub Copilot Instructions — Lead Manager
# Place this file at: .github/copilot-instructions.md
# VS Code picks it up automatically for every Copilot Chat session in this workspace.

---

## Project Overview

A full-stack **Lead Manager** web app — Meru Technosoft screening assignment.
Sales users can create, view, edit, and delete leads through a React UI backed
by an Express REST API, with SQLite as the database.

---

## Repository Structure

```
lead-manager/
├── .github/
│   └── copilot-instructions.md
├── client/                        ← Vite + React 18 + TailwindCSS
│   ├── src/
│   │   ├── api/leadsApi.js        ← all fetch calls to backend
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── LeadModal.jsx
│   │   │   ├── LeadsTable.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── SearchFilterBar.jsx
│   │   │   └── StatsBar.jsx
│   │   ├── hooks/useLeads.js
│   │   ├── pages/AuthPage.jsx     ← bonus: login/register
│   │   └── App.jsx
│   ├── .env.example
│   └── vite.config.js
└── server/
    ├── data/                      ← SQLite .db file (gitignored)
    ├── middleware/
    │   ├── auth.js                ← JWT verification
    │   └── validateLead.js        ← request body validation
    ├── routes/
    │   ├── auth.js
    │   └── leads.js
    ├── db.js                      ← better-sqlite3 singleton + migration
    ├── index.js                   ← Express entry point
    └── .env.example
```

---

## Tech Stack

| Layer      | Technology                | Notes                              |
| ---------- | ------------------------- | ---------------------------------- |
| Frontend   | React 18 (Vite)           | No CRA                             |
| Styling    | TailwindCSS v3            | No component library               |
| Backend    | Node.js + Express         | REST API only                      |
| Database   | SQLite via better-sqlite3 | Synchronous — no async on DB calls |
| Auth       | jsonwebtoken + bcrypt     | Bearer token in Authorization header |
| Env vars   | dotenv                    | Never commit .env                  |

---

## DATABASE — Read This Before Writing Any DB Code

This project uses **`better-sqlite3`** which has a **synchronous API**.
There are NO callbacks, NO Promises, NO async/await on database calls.

### Correct pattern

```js
const db = require('../db');

// SELECT one row
const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);

// SELECT many rows
const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();

// INSERT
const result = db.prepare('INSERT INTO leads (name, email) VALUES (?, ?)').run(name, email);
console.log(result.lastInsertRowid); // the new row's id

// UPDATE
db.prepare('UPDATE leads SET name = ?, updated_at = datetime("now") WHERE id = ?').run(name, id);

// DELETE
db.prepare('DELETE FROM leads WHERE id = ?').run(id);
```

### NEVER write these patterns

```js
// ❌ Wrong — these are sqlite3 (callback) or Prisma/Knex patterns, NOT better-sqlite3
db.run(sql, params, callback);
await db.query(sql);
db.prepare(sql).run(params).then(...);
db.all(sql, params, (err, rows) => {});
```

**The DB singleton lives in `server/db.js` — always import it, never re-open the file.**

---

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),   -- NULL if auth not implemented
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  phone      TEXT,
  company    TEXT,
  source     TEXT    NOT NULL,               -- see LEAD_SOURCES below
  status     TEXT    NOT NULL DEFAULT 'New', -- see LEAD_STATUSES below
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_name    ON leads(name);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
```

---

## Allowed Enum Values

```js
// Use these exact strings everywhere — dropdowns AND backend validation
const LEAD_SOURCES  = ['Website', 'Referral', 'Cold Call', 'Social', 'Other'];
const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
```

---

## API Contract

```
GET    /api/leads          ?search=&status=&page=1&limit=10
POST   /api/leads          Body: { name, email, phone, company, source, status }
PUT    /api/leads/:id      Body: same fields (name + email always required)
DELETE /api/leads/:id
GET    /api/leads/stats    Returns: { New: 0, Contacted: 0, Qualified: 0, Lost: 0 }

POST   /api/auth/register  Body: { email, password }
POST   /api/auth/login     Body: { email, password }  →  { token }
```

### IMPORTANT — Route order in Express

```js
// /stats MUST be defined BEFORE /:id or Express treats "stats" as an id param
router.get('/stats', statsHandler);  // ← first
router.get('/:id',  getOneHandler); // ← second
```

---

## Backend Rules

- Always return JSON. Never use `res.send()` with plain strings on API routes.
- Error response shape: `{ error: 'message' }` or `{ errors: ['field: reason'] }`.
- Use `req.userId` (set by auth middleware) to scope lead queries. Never trust `req.body.user_id`.
- HTTP status codes to use:
  - `200` — OK (GET, PUT, DELETE success)
  - `201` — Created (POST success)
  - `400` — Validation error
  - `401` — Unauthenticated
  - `404` — Resource not found
  - `500` — Unexpected server error
- When `.get(id)` returns `undefined`, always respond with `404 { error: 'Lead not found' }`.
- Add a catch-all error middleware at the bottom of `index.js`.

---

## Frontend Rules

- **No axios** — use the native `fetch` API everywhere.
- API base URL: `import.meta.env.VITE_API_URL` — never hardcode `http://localhost:4000`.
- **No HTML `<form>` tags** — use controlled React state with `onClick` / `onChange` handlers.
- All API calls must be wrapped in `try/catch`. On error, call `toast.error(err.message)`.
- State management: `useState` + `useEffect` + custom hooks only. No Redux, no Zustand.
- Styling: Tailwind utility classes only. No inline `style={{}}` props unless unavoidable.
- Every `useEffect` must have a correct, complete dependency array to avoid infinite loops.
- JWT token stored in `localStorage` under the key `'lead_token'`.
- Attach token to every request: `Authorization: 'Bearer ' + token`.

---

## Status Badge Colors (Tailwind)

```js
const STATUS_COLORS = {
  New:       'bg-blue-100 text-blue-800',
  Contacted: 'bg-yellow-100 text-yellow-800',
  Qualified: 'bg-green-100 text-green-800',
  Lost:      'bg-red-100 text-red-800',
};
```

---

## Validation Rules (apply on BOTH frontend and backend)

| Field     | Rule                                              |
| --------- | ------------------------------------------------- |
| `name`    | Required, non-empty string                        |
| `email`   | Required, matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| `phone`   | Optional                                          |
| `company` | Optional                                          |
| `source`  | Must be one of LEAD_SOURCES                       |
| `status`  | Must be one of LEAD_STATUSES                      |

Frontend: show inline error messages below each invalid field.
Backend: return `400 { errors: ['name is required', 'invalid email'] }`.

---

## Environment Variables

### server/.env.example
```
PORT=4000
DB_PATH=./data/leads.db
JWT_SECRET=change_this_to_a_long_random_string
```

### client/.env.example
```
VITE_API_URL=http://localhost:4000
```

---

## Common Mistakes — Copilot Must Never Do These

1. Do NOT use the `sqlite3` npm package — this project uses `better-sqlite3`.
2. Do NOT use `async/await` on `better-sqlite3` calls — it is synchronous.
3. Do NOT use `useEffect` without a dependency array — causes infinite loops.
4. Do NOT forget `cors()` middleware in `server/index.js` — the frontend runs on a different port.
5. Do NOT hardcode the API URL in client code — always use `import.meta.env.VITE_API_URL`.
6. Do NOT commit `.env` or the `data/` folder — both must be in `.gitignore`.
7. Do NOT define `/api/leads/stats` after `/api/leads/:id` — Express will match "stats" as an id.
8. Do NOT use `<form>` tags in React components — use div + button with handlers.
9. Do NOT create new DB connections — import the singleton from `server/db.js`.
10. Do NOT return raw SQLite errors to the client — catch and return a clean 500 message.