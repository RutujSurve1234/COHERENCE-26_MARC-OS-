class AnalyticsService:

    def __init__(self):

        self.metrics = {
            "total_leads": 0,
            "workflow_executions": 0,
            "emails_sent": 0,
            "emails_blocked": 0,
            "replies_received": 0
        }

    def track_event(self, event):

        if event in self.metrics:
            self.metrics[event] += 1

    def get_metrics(self):

        return self.metrics