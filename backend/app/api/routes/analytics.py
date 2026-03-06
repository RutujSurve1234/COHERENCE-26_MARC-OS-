from fastapi import APIRouter
from app.core.analytics import analytics

router = APIRouter()


@router.get("/metrics")
def get_metrics():

    return analytics.get_metrics()