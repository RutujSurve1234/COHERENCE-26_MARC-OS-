import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.throttler import throttler
from app.core.analytics import analytics

# --- EMAIL CONFIGURATION ---
SENDER_EMAIL = "sparky.28045@gmail.com"  # <-- Replace with your Gmail address
SENDER_PASSWORD = "ngimokkfxhphxgbi"   # <-- Replace with your 16-character App Password (no spaces!)

def send_email(lead_email: str, subject: str, message_body: str):
    
    # 1. Check Safety Throttler First
    allowed, reason = throttler.can_send_message(lead_email)

    if not allowed:
        analytics.track_event("emails_blocked")
        return {
            "status": "blocked",
            "reason": reason
        }

    # 2. Attempt to Actually Send the Email
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = lead_email
        msg['Subject'] = subject

        # Attach the message body
        msg.attach(MIMEText(message_body, 'plain'))

        # Connect to Gmail SMTP Server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls() # Secure the connection
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        # Send and close
        server.send_message(msg)
        server.quit()
        
    except Exception as e:
        print(f"Failed to send email to {lead_email}: {e}")
        return {
            "status": "failed",
            "reason": str(e)
        }

    # 3. If email sent successfully, record the analytics!
    throttler.record_message(lead_email)
    analytics.track_event("emails_sent")

    print(f"Successfully sent email to: {lead_email}")

    return {
        "status": "sent",
        "email": lead_email
    }