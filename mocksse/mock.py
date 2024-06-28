import json
import time
from data import IDCHAT, IDAGENTE

from random import choice
from flask import Flask, Response, jsonify, render_template, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def generate_events():
    while True:
        potential_data = [
            {
                "type": "CHAT_SUPERVISOR",
                "event": {
                    "chatSupervisor": {
                        "statusChat": choice(["OPEN", "CLOSED"]),
                        "idChat": choice(IDCHAT),
                        "status": choice(["BOT", "AGENT"]),
                        "campaignId": choice([1988, 2336]),
                    }
                },
            },
            {
                "type": "AGENT_SUPERVISOR",
                "event": {
                    "agentSupervisor": {
                        "userId": choice(IDAGENTE),
                        "status": choice(["ONLINE", "LOGOUT", "MISSING"]),
                        "campaignIds": choice([[1988], [2336], [1988, 2336]]),
                    }
                },
            },
            {
                "type": "CHAT_RESPONSE_TIME",
                "event": {
                    "responseTime": {
                        "responseTimeAvg": choice([150, 250, 350]),
                        "responseTimeMax": choice([100, 200, 300]),
                        "responseTimeMin": choice([400, 500, 700]),
                        "responseTimeWeek": 4,
                        "campaignId": choice([1988, 2336]),
                    },
                },
            },
        ]

        event_data = choice(potential_data)
        datica = {
            "type": "AGENT_SUPERVISOR",
            "event": {
                "agentSupervisor": {
                    "userId": 18857,
                    "status": "ONLINE",
                    "campaignIds": [1988, 2336],
                }
            },
        }
        yield f"id: {int(time.time())}\nevent: Notification\ndata: {json.dumps(event_data)}\n\n"
        time.sleep(0.8)


@app.route("/")
def helloworld():
    return render_template("ui.html")


@app.errorhandler(504)
def gateway_timeout(error):
    return (
        jsonify(
            {
                "error": "Gateway Timeout",
                "message": "La petición ha tardado demasiado tiempo en responder.",
            }
        ),
        504,
    )


@app.route("/bff-supervisor-event/api/rest/v1/events/generic/18877")
def sse_request():
    # time.sleep(5)  # Ajusta este valor según sea necesario
    # abort(504)
    return Response(generate_events(), mimetype="text/event-stream")


@app.route(
    "/bff-supervisor-event/api/rest/v1/user/agents-by-campaigns", methods=["POST"]
)
def agent_request():
    response_data = {"count": 20}
    return jsonify(response_data)


@app.route("/bff-supervisor-event/api/rest/v1/user/response-time", methods=["POST"])
def time_request():
    response_data = {
        "responseTimeAvg": 1,
        "responseTimeMax": 58,
        "responseTimeMin": 3,
        "responseTimeWeek": 4,
        "campaignId": 1988,
    }
    return jsonify(response_data)


""" @app.route("/event/generic/18877")
def sse_request():
    content = request.json["evento"]
    print(f"Evento recibido: {content}")
    return {"status": "Evento recibido"}, 200 """


if __name__ == "__main__":
    app.run(debug=True, port=5000)
