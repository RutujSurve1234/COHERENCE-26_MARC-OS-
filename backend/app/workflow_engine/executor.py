import random
import time

from app.agents.lead_research_agent import research_lead
from app.agents.message_writer_agent import generate_outreach_message
from app.services.email_service import send_email
from app.core.analytics import analytics


def execute_workflow(lead, workflow):

    # Track workflow execution
    analytics.track_event("workflow_executions")

    context = {
        "lead": lead,
        "insight": None,
        "message": None,
        "email_status": None
    }

    for step in workflow["steps"]:

        step_type = step["type"]

        if step_type == "research":

            result = research_lead(lead["company"])
            context["insight"] = result["insight"]

        elif step_type == "generate_message":

            context["message"] = generate_outreach_message(
                lead["name"],
                lead["company"],
                lead["role"],
                context["insight"]
            )

        elif step_type == "delay":

            delay_hours = random.randint(
                step["min_hours"],
                step["max_hours"]
            )

            print(f"Waiting {delay_hours} hours")

            # Hackathon simulation (seconds instead of hours)
            time.sleep(delay_hours)

        elif step_type == "send_email":

            if "email" not in lead:
                return {"error": "Lead email missing"}

            result = send_email(
                lead["email"],
                context["message"]
            )

            context["email_status"] = result

    return context