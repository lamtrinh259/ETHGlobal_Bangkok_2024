import json
import os
import sys
import time

from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from openai import OpenAI

# Import CDP Agentkit Langchain Extension.
from cdp_langchain.agent_toolkits import CdpToolkit
from cdp_langchain.utils import CdpAgentkitWrapper
from langchain_core.prompts import ChatPromptTemplate
from cdp_langchain.tools import CdpTool
from pydantic import BaseModel, Field
from cdp import *

# Configure a file to persist the agent's CDP MPC Wallet Data.
wallet_data_file = "wallet_data.txt"

def initialize_agent():
    """Initialize the agent with CDP Agentkit."""
    # Initialize LLM.
    llm = ChatOpenAI(model="gpt-4o") # gpt-4o-mini

    wallet_data = None

    if os.path.exists(wallet_data_file):
        with open(wallet_data_file) as f:
            wallet_data = f.read()

    # Configure CDP Agentkit Langchain Extension.
    values = {}
    if wallet_data is not None:
        # If there is a persisted agentic wallet, load it and pass to the CDP Agentkit Wrapper.
        values = {"cdp_wallet_data": wallet_data}

    agentkit = CdpAgentkitWrapper(**values)

    # persist the agent's CDP MPC Wallet Data.
    wallet_data = agentkit.export_wallet()
    with open(wallet_data_file, "w") as f:
        f.write(wallet_data)

    # Initialize CDP Agentkit Toolkit and get tools.
    cdp_toolkit = CdpToolkit.from_cdp_agentkit_wrapper(agentkit)
    tools = cdp_toolkit.get_tools()

    # Store buffered conversation history in memory.
    memory = MemorySaver()
    config = {"configurable": {"thread_id": "CDP Agentkit Chatbot Example!"}}

    # System message to instruct agent to support with
    system_prompt = "You are an AI agent whose job is to vote on DAO governance proposals on behalf of the users. You will receive a conversation from users as inputs to instruct you on the user's preferences, your role is to choose the decide on which vote would align the most with the user's preferences. There's no right or wrong answer, but the output must be in the form of a numeric integer in this list [0, 1, 2]. 0 refers to 'Yes,' 1 refers to 'No', and 2 is 'Abstain from voting'"
    # Create ReAct Agent using the LLM and CDP Agentkit tools.
    return create_react_agent(
        llm,
        tools=tools,
        checkpointer=memory,
        state_modifier=system_prompt # modify the system prompt above as needed
      #   "You are a helpful agent that can interact onchain using the Coinbase Developer Platform Agentkit. You are empowered to interact onchain using your tools. If you ever need funds, you can request them from the faucet if you are on network ID `base-sepolia`. If not, you can provide your wallet details and request funds from the user. If someone asks you to do something you can't do with your currently available tools, you must say so, and encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to docs.cdp.coinbase.com for more informaton. Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.",
    ), config

def agent_decide_on_vote(conversation: str) -> int:
    """
    Decide on a vote based on the user's preferences in the conversation.
    Uses the updated OpenAI API with the gpt-4o model.
    """
    client = OpenAI(
      organization='org-XerYJx3Ux9BZAeCo0VSu3y3Z',
      project='proj_8XC3v1clv3MqHnjGkT3igU7Q',
      )

    try:
        # Define the system message (instructions for the assistant)
        system_message = {
            "role": "system",
            "content": (
                "You are an AI agent whose job is to vote on DAO governance proposals on behalf of the users. "
                "You will receive a conversation from users as inputs to instruct you on the user's preferences. "
                "Your role is to choose the decision that aligns the most with the user's preferences. "
                "There's no right or wrong answer, but the output must be in the form of a numeric integer in this list [0, 1, 2]. "
                "0 refers to 'Yes,' 1 refers to 'No', and 2 is 'Abstain from voting'."
            )
        }

        # Define the user message (conversation provided by the user)
        user_message = {
            "role": "user",
            "content": conversation
        }

        # Make the API call
        response = client.chat.completions.create(
            model="gpt-4o",  # Use the desired model
            messages=[system_message, user_message],
            max_tokens=10,  # Limit the output to a short answer
            temperature=0  # Set temperature for deterministic responses
        )
      #   print('the response is', response)

        # Extract and validate the decision
        decision_content = response.choices[0].message.content.strip()
      #   print('the decision content is', decision_content)
        decision = int(decision_content)

        if decision not in [0, 1, 2]:
            raise ValueError(f"Invalid decision: {decision_content}")

        return decision

    except Exception as e:
        raise RuntimeError(f"An error occurred while deciding on the vote: {e}")


def agent_decide_on_vote_langchain(conversation: str) -> int:
    """Decide on a vote based on the user's preferences in the conversation."""
    # Initialize LLM
    llm = ChatOpenAI(model="gpt-4o")

    # System message to instruct agent on decision-making
    system_prompt = (
        "You are an AI agent whose job is to vote on DAO governance proposals on behalf of the users. "
        "You will receive a conversation from users as inputs to instruct you on the user's preferences, "
        "your role is to choose the decision that aligns the most with the user's preferences. "
        "There's no right or wrong answer, but the output must be in the form of a numeric integer in this list [0, 1, 2]. "
        "0 refers to 'Yes,' 1 refers to 'No', and 2 is 'Abstain from voting'."
    )

    # Create a prompt template using the correct format
    prompt_template = ChatPromptTemplate([
        ("system", system_prompt),
        ("human", conversation)
    ])

    # Generate a response from the LLM
    response = llm.generate(prompt_template)

    # Extract the decision from the response
    decision = int(response.content.strip())

    return decision

# Autonomous Mode
def run_autonomous_mode(agent_executor, config, interval=10):
    """Run the agent autonomously with specified intervals."""
    print("Starting autonomous mode...")
    while True:
        try:
            # Provide instructions autonomously
            thought = (
                "Be creative and do something interesting on the blockchain. "
                "Choose an action or set of actions and execute it that highlights your abilities."
            )

            # Run agent in autonomous mode
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=thought)]}, config):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")

            # Wait before the next action
            time.sleep(interval)

        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Chat Mode
def run_chat_mode(agent_executor, config):
    """Run the agent interactively based on user input."""
    print("Starting chat mode... Type 'exit' to end.")
    while True:
        try:
            user_input = input("\nUser: ")
            if user_input.lower() == "exit":
                break

            # Run agent with the user's input in chat mode
            for chunk in agent_executor.stream(
                {"messages": [HumanMessage(content=user_input)]}, config):
                if "agent" in chunk:
                    print(chunk["agent"]["messages"][0].content)
                elif "tools" in chunk:
                    print(chunk["tools"]["messages"][0].content)
                print("-------------------")

        except KeyboardInterrupt:
            print("Goodbye Agent!")
            sys.exit(0)


# Mode Selection
def choose_mode():
    """Choose whether to run in autonomous or chat mode based on user input."""
    while True:
        print("\nAvailable modes:")
        print("1. chat    - Interactive chat mode")
        print("2. auto    - Autonomous action mode")

        choice = input(
            "\nChoose a mode (enter number or name): ").lower().strip()
        if choice in ["1", "chat"]:
            return "chat"
        elif choice in ["2", "auto"]:
            return "auto"
        print("Invalid choice. Please try again.")


def main():
    """Start the chatbot agent."""
    agent_executor, config = initialize_agent()

    mode = choose_mode()
    if mode == "chat":
        run_chat_mode(agent_executor=agent_executor, config=config)
    elif mode == "auto":
        run_autonomous_mode(agent_executor=agent_executor, config=config)


if __name__ == "__main__":
    print("Starting Agent...")
    main()
