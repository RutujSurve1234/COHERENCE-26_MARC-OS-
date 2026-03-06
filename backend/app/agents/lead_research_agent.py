from app.research.company_news import fetch_company_news
from app.research.insight_extractor import generate_company_insight

def research_lead(company: str):

    headlines = fetch_company_news(company)

    insight = generate_company_insight(company, headlines)

    return {
        "company": company,
        "headlines": headlines,
        "insight": insight
    }