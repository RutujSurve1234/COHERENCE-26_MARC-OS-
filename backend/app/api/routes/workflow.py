from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

from app.workflow_engine.executor import execute_workflow

router = APIRouter()


class Lead(BaseModel):
    name: str
    company: str
    role: str
    email: str


class Workflow(BaseModel):
    steps: List[Dict[str, Any]]


class WorkflowRequest(BaseModel):
    lead: Lead
    workflow: Workflow


@router.post("/execute-workflow")
def run_workflow(data: WorkflowRequest):

    result = execute_workflow(
        data.lead.dict(),
        data.workflow.dict()
    )

    return result