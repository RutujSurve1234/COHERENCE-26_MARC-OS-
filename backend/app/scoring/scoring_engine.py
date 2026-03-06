def calculate_lead_score(activity):

    # enforce hierarchy
    if activity["clicked"]:
        activity["opened"] = True

    if activity["replied"]:
        activity["opened"] = True

    score = 0

    if activity["opened"]:
        score += 20

    if activity["clicked"]:
        score += 30

    if activity["replied"]:
        score += 50

    return score