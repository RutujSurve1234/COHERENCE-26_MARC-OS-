from groq import Groq
from app.core.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def generate_company_insight(company, headlines):

    prompt = f"""
    Company: {company}

    Recent News Headlines:
    {headlines}

    Summarize the key business insight in 2 sentences
    that would help create a personalized sales outreach message.
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
    )

    return completion.choices[0].message.content