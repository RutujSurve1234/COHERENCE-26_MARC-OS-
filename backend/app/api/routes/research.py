from fastapi import APIRouter
from app.agents.lead_research_agent import research_lead

router = APIRouter()

@router.get("/research/{company}")
def research_company(company: str):

    result = research_lead(company)

    return result