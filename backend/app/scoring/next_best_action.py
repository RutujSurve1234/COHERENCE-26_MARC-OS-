def recommend_next_action(activity, probability):

    if activity["replied"]:
        return "Schedule Meeting"

    if probability > 0.75:
        return "Send Meeting Invite"

    if activity["opened"] and not activity["clicked"]:
        return "Send Follow-up Email"

    if activity["clicked"]:
        return "Send LinkedIn Message"

    return "Send Initial Outreach Email"