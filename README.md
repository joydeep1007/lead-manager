# Lead Manager

## 1. Project Description

Lead Manager is a full-stack web application that lets sales users create, view, search, filter, edit, and delete leads through a clean React dashboard backed by a JWT-authenticated Express REST API, with SQLite as the data store. Each user's leads are private and scoped to their own account.

## 2. Tech Stack

| Layer      | Technology                  | Why                                                                 |
| ---------- | ---------------------------- | -------------------------------------------------------------------- |
| Frontend   | React 18 (Vite)              | Fast dev server/HMR and minimal config compared to CRA                |
| Styling    | TailwindCSS v3                | Utility-first styling for rapid, consistent UI without a component lib |
| Backend    | Node.js + Express             | Lightweight, unopinionated REST API framework                        |
| Database   | SQLite via `better-sqlite3`   | Zero-config, file-based DB with a simple synchronous API — ideal for a small assignment-scale app |
| Auth       | `jsonwebtoken` + `bcrypt`     | Stateless token auth with industry-standard password hashing          |
| Env config | `dotenv`                      | Standard way to keep secrets/config out of source code                |

## 3. Local Setup

### Prerequisites

- Node.js 18+
- npm

### Environment Variables

**`server/.env`**
```
PORT=4000
DB_PATH=./data/leads.db
JWT_SECRET=change_this_to_a_long_random_string
```

**`client/.env`**
```
VITE_API_URL=http://localhost:4000
```

### Run the Server

```bash
cd server
npm install
npm start          # starts Express on http://localhost:4000
```

Optional — seed the database with sample leads:

```bash
npm run seed
```

### Run the Client

```bash
cd client
npm install
npm run dev         # starts Vite on http://localhost:5173
```

Open `http://localhost:5173`, register an account, and sign in to start managing leads.

## 4. API Endpoint Reference

### Auth (`/api/auth`)

| Method | Path        | Description                                      |
| ------ | ----------- | ------------------------------------------------- |
| POST   | `/register` | Create a new user account (hashes password)        |
| POST   | `/login`    | Authenticate and receive a JWT (`{ token }`, 7d expiry) |

### Leads (`/api/leads` — all routes require `Authorization: Bearer <token>`)

| Method | Path          | Description                                              |
| ------ | ------------- | --------------------------------------------------------- |
| GET    | `/`           | List the authenticated user's leads; supports `?search=` and `?status=` filters |
| POST   | `/`           | Create a new lead                                          |
| PUT    | `/:id`        | Update fields on an existing lead                          |
| DELETE | `/:id`        | Delete a lead                                               |
| GET    | `/stats`      | Return lead counts grouped by status                        |

### Health

| Method | Path      | Description              |
| ------ | --------- | ------------------------- |
| GET    | `/health` | Basic server health check |

## 5. Assumptions Made During Development

- Each lead belongs to exactly one user (`leads.user_id`); there is no team/shared-lead concept.
- A simple `status` enum (`New`, `Contacted`, `Qualified`, `Lost`) and `source` enum (`Website`, `Referral`, `Cold Call`, `Social`, `Other`) are sufficient for this assignment's scope — no admin UI to manage these lists.
- JWT is stored in `localStorage` (not an httpOnly cookie), acceptable for this assignment but not ideal for production due to XSS exposure.
- "Last Contacted" in the UI is derived from `updated_at` since there's no dedicated contact-log/activity table.
- SQLite is sufficient for the expected scale; no need for a client-server DB like Postgres.

## 6. What I Would Improve With More Time

- Add a dedicated activity/interaction log per lead instead of relying on `updated_at`.
- Add pagination and sorting to the leads list endpoint and table.
- Move the JWT out of `localStorage` into an httpOnly cookie, and add refresh-token rotation.
- Add automated tests (API integration tests, component tests) and CI.
- Build out the Pipeline/Analytics/Settings sections referenced in the nav (currently Leads-only).
- Add role-based access (e.g. admin can view all leads, manage team members).
- Add CSV import/export for leads.
- Add optimistic UI updates and toast notifications for create/update/delete actions.

## 7. Live Demo

https://lead-manager-steel.vercel.app/
