from flask import Flask, request, Response, stream_with_context, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from agent.initialize_agent import initialize_agent
from agent.run_agent import run_agent
from agents import agent_decide_on_vote
from utils import parse_final_result
from db.setup import setup
from db.tokens import get_tokens
from db.nfts import get_nfts

load_dotenv()
app = Flask(__name__)
CORS(app)

# Setup SQLite tables
setup()

# Initialize the agent
agent_executor = initialize_agent()
app.agent_executor = agent_executor


@app.route("/", methods=['GET'])
def hello():
    return "Welcome to Votr"

@app.route('/api/parse_input', methods=['POST'])
def parse_input() -> str:
    """ The bot gets the entire conversation, and use that to
    decide on the result of the vote
    The return value must be str, dict, or other accepted forms"""
    data = request.json
    print("The received data is", data)
    # Assuming 'input' and 'config' are part of the message or data
    user_input = data.get('message')
    print("User input is", user_input)

    # Call the agent_decide_on_vote function which also initializes the agent
    result = agent_decide_on_vote(user_input)
    print("The result is", result)

    return jsonify({'result': result})

@app.route('/api/receive_input', methods=['POST'])
def receive_input() -> str:
    """The return value must be str, dict, or other accepted forms"""
    data = request.json
#     print("The received data is", data)
    # Assuming 'input' and 'config' are part of the message or data
    user_input = data.get('message')
#     print("User input is", user_input)
    config = data.get('config', {})
#     print("The config is", config)

    # Call the run_agent function with the user input
    response = run_agent(user_input, agent_executor, config)
#     print("The response is", response)
    # Collect the response from the generator
    result = ''.join(response)

    # Parse the final result
    parsed_result = parse_final_result(result)

    return jsonify({'result': result, 'parsed_result': parsed_result})

# Interact with the agent
@app.route("/api/chat", methods=['POST'])
def chat():
    try:
        data = request.get_json()
        # Parse the user input from the request
        input = data['input']
        # Use the conversation_id passed in the request for conversation memory
        config = {"configurable": {"thread_id": data['conversation_id']}}
        return Response(
            stream_with_context(run_agent(input, app.agent_executor, config)),
            mimetype='text/event-stream',
            headers={
                'Cache-Control': 'no-cache',
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        )
    except Exception as e:
        app.logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# Retrieve a list of tokens the agent has deployed
@app.route("/tokens", methods=['GET'])
def tokens():
    try:
        tokens = get_tokens()
        return jsonify({'tokens': tokens}), 200
    except Exception as e:
        app.logger.error(f"Unexpected error in tokens endpoint: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# Retrieve a list of tokens the agent has deployed
@app.route("/nfts", methods=['GET'])
def nfts():
    try:
        nfts = get_nfts()
        return jsonify({'nfts': nfts}), 200
    except Exception as e:
        app.logger.error(f"Unexpected error in nfts endpoint: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == "__main__":
    app.run()
