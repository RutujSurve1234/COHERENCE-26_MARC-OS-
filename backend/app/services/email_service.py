from app.core.throttler import throttler
from app.core.analytics import analytics


def send_email(lead_email, message):

    allowed, reason = throttler.can_send_message(lead_email)

    if not allowed:

        analytics.track_event("emails_blocked")

        return {
            "status": "blocked",
            "reason": reason
        }

    throttler.record_message(lead_email)

    analytics.track_event("emails_sent")

    print("Sending email to:", lead_email)
    print(message)

    return {
        "status": "sent",
        "email": lead_email
    }