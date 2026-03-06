import requests
from app.core.config import NEWS_API_KEY

def fetch_company_news(company: str):

    url = (
        f"https://newsapi.org/v2/everything?"
        f"q={company}&sortBy=publishedAt&apiKey={NEWS_API_KEY}"
    )

    response = requests.get(url)

    data = response.json()

    articles = data.get("articles", [])[:5]

    headlines = [article["title"] for article in articles]

    return headlines