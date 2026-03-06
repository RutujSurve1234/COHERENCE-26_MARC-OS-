from app.scoring.behavior_tracker import track_lead_activity
from app.scoring.scoring_engine import calculate_lead_score
from app.scoring.conversion_predictor import predict_conversion
from app.scoring.next_best_action import recommend_next_action


def score_lead(opened, clicked, replied):

    activity = track_lead_activity(opened, clicked, replied)

    score = calculate_lead_score(activity)

    probability = predict_conversion(activity)

    action = recommend_next_action(activity, probability)

    return {
        "activity": activity,
        "score": score,
        "conversion_probability": round(probability, 2),
        "recommended_action": action
    }