# Backend README

This document explains how to run migrations, tests and the backend server locally.

## Requirements

- Node.js 18+ (tested with 22.x)
- npm

## Setup

1. Install dependencies

```powershell
cd backend
npm install
```

2. Ensure the `database` folder exists (it should already be in the repo). The app uses `database/store.db` by default.

## Migrations

A simple migration runner is included at `backend/migrate.js`. Migrations live in `backend/migrations/` and are tracked in the `migrations` table.

To run migrations:

```powershell
cd backend
node migrate.js
```

There is also a convenience npm script:

```powershell
npm run migrate:run
```

Notes:

- Migrations support both `.sql` and `.js` files. `.js` files should export `module.exports.run = async function(db){}` and will receive the sqlite3 `db` instance.
- For safety, review migration files before running in production and back up your DB.

## Logging

Logger is configured with `winston` and `winston-daily-rotate-file`. Logs are written to `backend/logs/` and rotated daily; by default logs are kept for 14 days. Set `LOG_LEVEL` or `NODE_ENV=production` to change verbosity.

## Tests

Tests use Jest and Supertest.

```powershell
cd backend
npm test
```

This runs all test suites (admin, admin-management, products/orders/stats, etc.).

## Running the server

```powershell
cd backend
npm run dev
# or
npm start
```

Server listens on `PORT` (default 5000). The frontend in the repo proxies `/api` calls to the backend in development.

## CI

Add a GitHub Actions workflow to run `npm ci` and `npm test` on PRs and pushes. If you'd like, I can add a sample workflow file.

---

If you want, I can also:

- Add the GitHub Actions CI workflow file
- Harden migrations further (transactional checks, dry-run)
- Expand tests for more edge cases

Tell me which you'd like next.
