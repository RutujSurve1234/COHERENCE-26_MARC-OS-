from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def generate_outreach_message(name, company, role, insight):

    prompt = f"""
    Write a personalized sales outreach email.

    Lead Name: {name}
    Company: {company}
    Role: {role}

    Company Insight:
    {insight}

    Requirements:
    - Professional tone
    - Personalized using the insight
    - Short (4–6 lines)
    - End with a soft call-to-action
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
    )

    return completion.choices[0].message.content