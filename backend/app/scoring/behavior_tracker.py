def track_lead_activity(opened=False, clicked=False, replied=False):

    activity = {
        "opened": opened,
        "clicked": clicked,
        "replied": replied
    }

    return activity