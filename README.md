# HYPER NOVA

HYPER NOVA is a fitness workout builder and progressive overload logger. It is being developed in phases, starting with a clean React frontend and Express API foundation.

## Project objective

Provide a place to build structured workouts and record training progress over time. This Phase 1 setup intentionally contains no authentication, workout functionality, dashboard statistics, or database integration.

## Technology stack

- **Frontend:** React, Vite, JavaScript, Tailwind CSS v4, React Router, Axios, Lucide React, Recharts
- **Backend:** Node.js, Express, JavaScript, CORS, dotenv, nodemon
- **Database:** PostgreSQL (planned for Phase 2)

## Project structure

```text
frontend/
  public/
  src/
    assets/
    components/
    context/
    hooks/
    layouts/
    pages/
    services/
    styles/
    utils/
backend/
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    utils/
    validators/
.env.example
.gitignore
README.md
```

## Requirements

- Node.js 20.19+ (or 22.12+) and npm

## Installation

Install dependencies in each application directory:

```bash
cd frontend
npm install
cd ../backend
npm install
```

Copy `.env.example` to `.env` in the project root and adjust values for your local environment. The database and JWT settings are placeholders for later phases; no database connection is made in Phase 1.

## Run the applications

Start the frontend in one terminal:

```bash
cd frontend
npm run dev
```

Start the backend in a second terminal:

```bash
cd backend
npm run dev
```

The Vite app is available at [http://localhost:5173](http://localhost:5173). The API listens on port `5000` by default; its health check is [http://localhost:5000/api/health](http://localhost:5000/api/health).

For a production frontend build, run `npm run build` from `frontend/`. To start the API without nodemon, run `npm start` from `backend/`.

Run the backend API tests with `npm test` from `backend/`.
