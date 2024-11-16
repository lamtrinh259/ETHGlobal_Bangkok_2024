import json

def format_sse(data: str, event: str = None, functions: str = []) -> str:
    """Format data as SSE"""
    response = {
        "event": event,
        "data": data
    }
    if (len(functions) > 0):
        response["functions"] = functions
    return json.dumps(response) + "\n"

def parse_final_result(conversation: str) -> int:
    """Parse the final result from the conversation string.
    This is the logic that allows AI to decide to vote for the choice(s)
    based on user preferences"""
    # Implement your logic to parse the conversation
    # For example, return 1 if a certain keyword is present
    if "approve" in conversation:
        return 0
    elif "reject" in conversation:
        return 1
    else:
      return 2


# ... existing code ...
