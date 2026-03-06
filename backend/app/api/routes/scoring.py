from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.lead_scoring_agent import score_lead

router = APIRouter()


class ScoringRequest(BaseModel):
    opened: bool
    clicked: bool
    replied: bool


@router.post("/score-lead")
def lead_scoring(data: ScoringRequest):

    result = score_lead(
        data.opened,
        data.clicked,
        data.replied
    )

    return result