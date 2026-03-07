from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Import your existing AI agent
from app.agents.message_writer_agent import generate_outreach_message
# Import the new email service
from app.services.email_service import send_email 

router = APIRouter()

# -----------------------------------
# PYDANTIC MODELS (Data Validation)
# -----------------------------------

# For generating AI messages
class MessageRequest(BaseModel):
    name: str
    company: str
    role: str
    insight: str

# For sending actual emails
class EmailRequest(BaseModel):
    to_email: str
    subject: str
    body: str


# -----------------------------------
# ROUTES
# -----------------------------------

# 1. Existing Route: Generate the AI Message
@router.post("/generate-message")
def generate_message(data: MessageRequest):
    message = generate_outreach_message(
        data.name,
        data.company,
        data.role,
        data.insight
    )
    return {"message": message}


# 2. New Route: Send the Email
@router.post("/send")
async def send_message_route(req: EmailRequest):
    result = send_email(
        lead_email=req.to_email,
        subject=req.subject,
        message_body=req.body
    )
    
    # Handle safety throttler blocks
    if result["status"] == "blocked":
        raise HTTPException(status_code=429, detail=f"Blocked by throttler: {result['reason']}")
    
    # Handle SMTP/Network failures
    if result["status"] == "failed":
        raise HTTPException(status_code=500, detail=f"Failed to send email: {result['reason']}")
        
    return {"status": "success", "message": f"Email sent to {req.to_email}"}