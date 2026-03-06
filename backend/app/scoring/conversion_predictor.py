import math


def predict_conversion(activity):

    # feature weights (simulated ML weights)
    w_open = 1.2
    w_click = 1.8
    w_reply = 2.5

    bias = -1

    x_open = 1 if activity["opened"] else 0
    x_click = 1 if activity["clicked"] else 0
    x_reply = 1 if activity["replied"] else 0

    z = (
        w_open * x_open
        + w_click * x_click
        + w_reply * x_reply
        + bias
    )

    probability = 1 / (1 + math.exp(-z))

    return probability