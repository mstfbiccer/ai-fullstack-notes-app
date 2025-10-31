# ai-fullstack-notes-app

Full-stack monorepo demo featuring:
- React (Vite) client
- Node.js (Express) server with Jest + Supertest tests
- PL/SQL sample procedure (intentionally flawed for teaching)
- Simple CI for server tests

## Structure
- `client/`: React UI to list and add notes via the backend API
- `server/`: Express API with in-memory notes and tests
- `db/`: PL/SQL procedure files

## Getting Started

1) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

2) Run backend

```bash
cd server
npm run dev
```

3) Run frontend (proxies /api to the server)

```bash
cd client
npm run dev
```

4) Run server tests

```bash
cd server
npm test
```

## Teaching Notes
- The PL/SQL procedure intentionally has issues (e.g., uses SELECT *, missing NO_DATA_FOUND handling) for debugging exercises.
- Frontend uses a Vite dev proxy to access `/api/notes` without CORS setup.
