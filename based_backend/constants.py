from typing import Final

# Event types
EVENT_TYPE_AGENT: Final[str] = "agent"
EVENT_TYPE_COMPLETED: Final[str] = "completed"
EVENT_TYPE_TOOLS: Final[str] = "tools"
EVENT_TYPE_ERROR: Final[str]= "error"

# Environment variables for Base Sepolia wallet generated on Replit
WALLET_ID_ENV_VAR: Final[str] = "bf3e5492-0308-4d90-a273-093d5edf4c95"
WALLET_SEED_ENV_VAR: Final[str] = "7dad01d2f0db9c16c8093e3d6f2ececfd4a8ae5c883987063716be931071ac51cd2fd2b63fb3c363f97488f08d842cc13eb837bc7724c07fce2d50fae7f66289"

# Errors
class InputValidationError(Exception):
    """Custom exception for input validation errors"""
    pass

# Actions
DEPLOY_TOKEN: Final[str] = "deploy_token"
DEPLOY_NFT: Final[str] = "deploy_nft"

# Agent
AGENT_MODEL: Final[str] = "gpt-4o"
AGENT_PROMPT: Final[str] = "You are an AI agent whose job is to vote on DAO governance proposals on behalf of the users. You will receive a conversation from users as inputs to instruct you on the user's preferences, your role is to choose the decide on which vote would align the most with the user's preferences. There's no right or wrong answer, but the output must be in the form of a numeric integer in this list [0, 1, 2]. 0 refers to 'Yes,' 1 refers to 'No', and 2 is 'Abstain from voting'"
