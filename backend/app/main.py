from fastapi import FastAPI

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

@app.get("/")
def health():
    return {"status": "Backend running"}

app.include_router(leads.router, prefix="/leads")
app.include_router(research.router, prefix="/ai")
app.include_router(message.router, prefix="/ai")
app.include_router(workflow.router, prefix="/automation")
app.include_router(scoring.router, prefix="/analytics")
app.include_router(analytics.router, prefix="/dashboard")