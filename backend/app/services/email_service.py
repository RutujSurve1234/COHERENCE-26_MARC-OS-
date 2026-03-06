from app.core.throttler import throttler


def send_email(lead_email, message):

    allowed, reason = throttler.can_send_message(lead_email)

    if not allowed:

        return {
            "status": "blocked",
            "reason": reason
        }

    throttler.record_message(lead_email)

    # simulated email send
    print("Sending email to:", lead_email)
    print(message)

    return {
        "status": "sent",
        "email": lead_email
    }