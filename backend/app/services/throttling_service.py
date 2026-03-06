import time


class ThrottlingService:

    def __init__(self):

        self.daily_limit = 50
        self.lead_limit = 5
        self.cooldown_seconds = 10

        self.messages_today = 0
        self.lead_messages = {}

        self.last_sent_time = 0

    def can_send_message(self, lead_email):

        current_time = time.time()

        if self.messages_today >= self.daily_limit:
            return False, "Daily message limit reached"

        if lead_email not in self.lead_messages:
            self.lead_messages[lead_email] = 0

        if self.lead_messages[lead_email] >= self.lead_limit:
            return False, "Lead message limit reached"

        if current_time - self.last_sent_time < self.cooldown_seconds:
            return False, "Cooldown active"

        return True, "Allowed"

    def record_message(self, lead_email):

        self.messages_today += 1
        self.lead_messages[lead_email] += 1
        self.last_sent_time = time.time()