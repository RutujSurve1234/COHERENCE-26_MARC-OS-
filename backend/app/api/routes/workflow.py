from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
import random

# IMPORT YOUR ACTUAL WORKING FUNCTIONS
from app.agents.message_writer_agent import generate_outreach_message
from app.services.email_service import send_email

router = APIRouter()

# --- MODELS ---
class Lead(BaseModel):
    name: str
    company: str
    role: str
    email: str

class Workflow(BaseModel):
    steps: List[Dict[str, Any]]

class BulkWorkflowRequest(BaseModel):
    campaign_name: str
    leads: List[Lead]
    workflow: Workflow
    min_delay_seconds: int = 10
    max_delay_seconds: int = 20

# --- RECURSIVE DIAGRAM EXECUTOR ---
async def execute_node_tree(nodes: List[Dict], lead: Lead, context: dict, step_depth: int = 1):
    """
    Recursively walks through the diagram blocks sent from React.
    If it hits a Condition, it goes down the True or False branch.
    """
    for node in nodes:
        node_type = node.get("type")
        config = node.get("config", {})

        if node_type == "trigger":
            print(f"   ⚡ [TRIGGER] Lead enrolled: {lead.name}")

        elif node_type == "ai":
            print("   🧠 [AI ENGINE] Generating personalized text...")
            # Make the AI smart: If this is deep in the tree (like a NO branch), make it a follow-up!
            if step_depth > 1:
                insight = f"I am following up because I know {lead.company} moves fast."
            else:
                insight = f"I noticed {lead.company} has been scaling rapidly."
                
            message = generate_outreach_message(lead.name, lead.company, lead.role, insight)
            context['drafted_message'] = message  # Save the AI text to use in the next Email block
            print(f"   ✅ [AI ENGINE] Drafted message successfully!")

        elif node_type == "email":
            print(f"   📧 [EMAIL] Sending to {lead.email}...")
            # Change subject if it's a follow-up branch
            subject = f"Following up regarding {lead.company}" if step_depth > 1 else f"Partnership Inquiry: {lead.company}"
            
            # Use AI text if available, otherwise use fallback text
            body = context.get('drafted_message', config.get("template", "Hello!"))
            
            email_result = send_email(lead_email=lead.email, subject=subject, message_body=body)
            
            if email_result["status"] == "sent":
                print(f"   ✅ SUCCESS: Email delivered to {lead.email}")
            else:
                print(f"   ⚠️ FAILED or BLOCKED: {email_result}")

        elif node_type == "linkedin":
            # We don't have a real LinkedIn API, so we mock it for the hackathon
            print(f"   🔵 [LINKEDIN] Simulating LinkedIn connection to {lead.name}...")
            await asyncio.sleep(1.5) # Simulate network delay
            print(f"   ✅ [LINKEDIN] Connection request & message sent.")

        elif node_type == "delay":
            unit = config.get("unit", "Seconds")
            duration = int(config.get("duration", 5))
            
            # Convert everything to seconds for the Python sleeper
            wait_time = duration
            if unit == "Minutes": wait_time = duration * 60
            elif unit == "Hours": wait_time = duration * 3600
            elif unit == "Days": wait_time = duration * 86400
            
            print(f"   ⏳ [DELAY] Pausing workflow for {duration} {unit} ({wait_time}s)...")
            await asyncio.sleep(wait_time)

        elif node_type == "condition":
            rule = config.get("rule", "")
            print(f"   🔀 [CONDITION] Evaluating rule: '{rule}'")
            
            # SIMULATING THE "REPLY" LOGIC FOR DEMO PURPOSES
            # We give them a random chance of having replied
            user_replied = random.choice([True, False]) 
            
            if user_replied:
                print(f"   🎉 [CONDITION MET] {lead.name} replied! Routing down the 'YES' branch.")
                true_branch = node.get("trueNodes", [])
                await execute_node_tree(true_branch, lead, context, step_depth + 1)
            else:
                print(f"   ❌ [CONDITION FAILED] No reply from {lead.name}. Routing down the 'NO' branch.")
                false_branch = node.get("falseNodes", [])
                await execute_node_tree(false_branch, lead, context, step_depth + 1)


# --- AUTOMATION LOOP ---
async def run_automated_campaign(campaign_name: str, leads: List[Lead], workflow: Workflow, min_delay: int, max_delay: int):
    print(f"\n🚀 [WORKFLOW STARTED] '{campaign_name}' initialized for {len(leads)} leads.")
    
    # Extract the step list from the Pydantic model
    steps = workflow.steps 

    for index, lead in enumerate(leads):
        print(f"\n[{index + 1}/{len(leads)}] Processing Lead: {lead.name} at {lead.company}...")
        
        # Shared context so the AI block can pass text to the Email block
        context = {} 
        
        try:
            # Tell the recursive engine to start executing the diagram!
            await execute_node_tree(steps, lead, context)
        except Exception as e:
            print(f"   ❌ Error processing {lead.name}: {str(e)}")

        print(f"   🏁 Finished processing {lead.name}.")
        
        # Anti-spam delay between DIFFERENT leads in the CSV
        if index < len(leads) - 1:
            delay = random.uniform(min_delay, max_delay)
            print(f"   ⏳ Waiting {delay:.1f} seconds before processing the next lead in the CSV...")
            await asyncio.sleep(delay)

    print(f"\n🎉 [WORKFLOW COMPLETE] Campaign finished running!")

# --- ROUTE ---
@router.post("/start-automated")
async def start_automated_workflow(req: BulkWorkflowRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(
        run_automated_campaign, 
        req.campaign_name, 
        req.leads, 
        req.workflow,
        req.min_delay_seconds,
        req.max_delay_seconds
    )
    return {"status": "success", "message": "Workflow executing based on visual diagram."}