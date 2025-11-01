# ai-fullstack-notes-app

Full-stack monorepo demo featuring:
- React (Vite) client
- Node.js (Express) server with Jest + Supertest tests
- PL/SQL sample procedure (intentionally flawed for teaching)
- Simple CI for server tests

## Structure
- `client/`: React UI to list and add notes via the backend API
- `server/`: Express API with Oracle DB integration (fallback to in-memory) and tests
- `db/`: PL/SQL schema and procedure files

## Getting Started

### 0) Git Setup (Optional)

```bash
# Initialize git repository
git init
# .gitignore is already included
git add .
git commit -m "Initial commit: Full-stack notes app with React, Express, and PL/SQL"
```

### 1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Database Setup (Optional)

If you have Oracle Database available:

```bash
# Create database user and tables
sqlplus sys/password@localhost:1521/XEPDB1 as sysdba
@db/schema/notes_table.sql

# Create procedures
@db/procedures/get_user_notes.sql

# Configure server environment
cd server
cp env.example .env
# Edit .env with your DB credentials
```

### 3) Run backend

**With Database:**
```bash
cd server
# Make sure .env is configured
npm run dev
```

**In-Memory Mode (No Database):**
```bash
cd server
USE_MEMORY_MODE=true npm run dev
```

### 4) Run frontend (proxies /api to the server)

```bash
cd client
npm run dev
```

### 5) Run server tests

```bash
cd server
npm test
```

## Features

- **Dual Mode**: Automatically falls back to in-memory mode if DB connection fails
- **Oracle Integration**: Uses `oracledb` driver with connection pooling
- **REST API**: GET/POST notes, PUT to complete notes
- **React UI**: Add, list, and complete notes with real-time updates

## Teaching Notes
- The PL/SQL procedure intentionally has issues (e.g., uses SELECT *, missing NO_DATA_FOUND handling) for debugging exercises.
- Frontend uses a Vite dev proxy to access `/api/notes` without CORS setup.
- Server gracefully handles DB connection failures and falls back to in-memory mode.
