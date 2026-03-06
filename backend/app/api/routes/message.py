from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.message_writer_agent import generate_outreach_message

router = APIRouter()


class MessageRequest(BaseModel):
    name: str
    company: str
    role: str
    insight: str


@router.post("/generate-message")
def generate_message(data: MessageRequest):

    message = generate_outreach_message(
        data.name,
        data.company,
        data.role,
        data.insight
    )

    return {"message": message}