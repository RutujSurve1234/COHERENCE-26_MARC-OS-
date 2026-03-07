from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    leads,
    research,
    message,
    workflow,
    scoring,
    analytics
)

app = FastAPI(
    title="AI Outreach Automation Engine",
    version="1.0"
)

# -------------------------------
# CORS CONFIGURATION
# -------------------------------
origins = [
    "http://localhost:5173",   # React dev server
    "http://127.0.0.1:5173",   # sometimes needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # allow requests from these origins
    allow_credentials=True,
    allow_methods=["*"],       # allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],       # allow all headers
)

# -------------------------------
# ROUTES
# -------------------------------
@app.get("/")
def health():
    return {"status": "Backend running"}

app.include_router(leads.router, prefix="/leads")
app.include_router(research.router, prefix="/ai")
app.include_router(message.router, prefix="/ai")
app.include_router(workflow.router, prefix="/automation")
app.include_router(scoring.router, prefix="/analytics")
app.include_router(analytics.router, prefix="/dashboard")