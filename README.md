# Fitness Builder

Fitness Builder is a workout builder and progressive overload logger project. Phase 1 set up the frontend/backend foundation, and Phase 2 adds PostgreSQL database connectivity and the initial database schema.

## Tech Stack

### Frontend
- React.js (Vite, JavaScript)
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- Recharts

### Backend
- Node.js
- Express.js
- JavaScript (ES Modules)
- PostgreSQL (`pg`)

### Database
- PostgreSQL (Phase 2 integration configured; workout/auth APIs are planned for later phases)

## Project Structure

```text
fitness builder/
├── .env.example
├── .gitignore
├── README.md
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── env.js
│       ├── controllers/
│       │   └── healthController.js
│       ├── db/
│       │   ├── initDb.js
│       │   ├── pool.js
│       │   ├── schema.sql
│       │   └── testConnection.js
│       ├── middleware/
│       │   └── errorHandler.js
│       ├── routes/
│       │   └── healthRoutes.js
│       └── server.js
└── frontend/
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── components/
        │   └── layout/
        │       └── Layout.jsx
        ├── pages/
        │   └── Home.jsx
        ├── routes/
        │   └── AppRoutes.jsx
        ├── services/
        │   └── api.js
        ├── hooks/
        └── utils/
```

## Prerequisites

- Node.js (LTS recommended)
- npm
- PostgreSQL 14+ (or a recent supported version)

## PostgreSQL Setup

### 1. Install PostgreSQL

- **Windows**: Download and install from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/). During installation, remember the password you set for the `postgres` user.
- **macOS**: `brew install postgresql@16` (or use the PostgreSQL installer).
- **Linux (Ubuntu/Debian)**: `sudo apt update && sudo apt install postgresql postgresql-contrib`

After installation, make sure the PostgreSQL service is running.

### 2. Create the database

Open a terminal and use `psql` (or pgAdmin) to create the project database:

```sql
CREATE DATABASE fitness_builder;
```

Example using `psql`:

```bash
psql -U postgres
CREATE DATABASE fitness_builder;
\q
```

If your PostgreSQL user is different, replace `postgres` with your user.

### 3. Configure backend environment variables

Copy the backend example env file and fill in your local PostgreSQL values:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitness_builder
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
```

> Do not commit real passwords or secrets. `.env` is ignored by git.

## Setup and Run

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your local PostgreSQL credentials
npm run db:init
npm run db:test
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Database Scripts

Run these from the `backend/` directory:

- `npm run db:init` - Creates/initializes the Phase 2 database schema from `src/db/schema.sql`.
- `npm run db:test` - Tests the PostgreSQL connection using values from `.env`.

## Database Schema (Phase 2)

The schema includes these tables:

- **users** - Basic user records (auth implementation comes in a later phase).
- **exercises** - Exercise catalog entries.
- **workout_templates** - User-owned workout templates.
- **workout_sessions** - User workout sessions, optionally linked to a template.
- **workout_sets** - Sets performed in a workout session for a specific exercise.
- **personal_records** - Personal record entries linked to users and exercises (optionally a workout set).

All tables include primary keys, foreign keys, constraints/checks where appropriate, and `created_at`/`updated_at` timestamps.

## Health Endpoints

### API health

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "message": "Fitness Builder API is running",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### Database health

```http
GET /api/health/db
```

Alias also supported:

```http
GET /api/db-health
```

Success example:

```json
{
  "status": "ok",
  "message": "Database connection successful",
  "database": "fitness_builder",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

If the database is unavailable, the endpoint returns HTTP `503` with an error message.

## Environment Variables

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:5000/api`)

### Backend (`backend/.env`)
- `PORT` - Backend server port (default: `5000`)
- `NODE_ENV` - Node environment (default: `development`)
- `CLIENT_ORIGIN` - Allowed frontend origin for CORS (default: `http://localhost:5173`)
- `DB_HOST` - PostgreSQL host (default: `localhost`)
- `DB_PORT` - PostgreSQL port (default: `5432`)
- `DB_NAME` - PostgreSQL database name (default: `fitness_builder`)
- `DB_USER` - PostgreSQL user (default: `postgres`)
- `DB_PASSWORD` - PostgreSQL password (no default; set locally)

## Phase Status

### Phase 1 - Completed
- [x] Frontend and backend folder structures created
- [x] React + Vite initialized
- [x] Frontend dependencies installed and configured
- [x] Node.js + Express initialized
- [x] Backend dependencies installed
- [x] Health-check API created at `GET /api/health`
- [x] CORS, dotenv, and error handling configured
- [x] `.gitignore`, `.env.example`, and `README.md` created
- [x] Frontend and backend startup verified

### Phase 2 - Completed
- [x] PostgreSQL connectivity configured with environment variables
- [x] Database connection pool and initialization scripts added
- [x] Schema created for users, exercises, workout templates, workout sessions, workout sets, and personal records
- [x] Primary keys, foreign keys, constraints/checks, and timestamps added
- [x] Database health check endpoint added at `GET /api/health/db`
- [x] Existing `/api/health` endpoint preserved
- [x] `.env.example` and README updated with PostgreSQL setup instructions

## Notes

- No authentication, frontend feature work, workout APIs, or analytics are implemented in Phase 2.
- PostgreSQL credentials are read from environment variables; do not hardcode real secrets.
- Database queries use parameterized `pg` queries where user/input values are involved.
- Do not commit or push automatically unless explicitly requested.
