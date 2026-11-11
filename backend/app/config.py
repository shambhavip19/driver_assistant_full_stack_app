import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'driveriq.db'}")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
