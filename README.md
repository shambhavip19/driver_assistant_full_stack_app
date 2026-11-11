# DriverIQ

DriverIQ is a production-style dashboard prototype for independent cab drivers in Chennai. It combines a modern frontend with a FastAPI backend and realistic demo data to surface ride profitability, demand patterns, operating costs, and decision-support insights.

## Tech stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Python + FastAPI + SQLAlchemy
- Data: SQLite fallback for local development; PostgreSQL/PostGIS ready for production
- Analytics: Python-based demo models and scoring logic

## Run locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open http://localhost:5173.

