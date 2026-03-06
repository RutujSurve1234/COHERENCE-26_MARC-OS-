from fastapi import FastAPI
from app.api.routes import leads
from app.api.routes import research

app = FastAPI()

app.include_router(leads.router, prefix="/leads")
app.include_router(research.router, prefix="/ai")