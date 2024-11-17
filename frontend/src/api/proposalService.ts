import axios from "axios";

export interface Proposal {
  dao: string;
  proposal: string;
  vote: string;
  reasoning: string;
}

export interface FetchProposalsResponse {
  proposals: Proposal[];
}

/**
 * Send chat history and selected DAOs to get proposals with AI votes
 * @param {string[]} chatHistory - The full chat history
 * @param {string[]} selectedDaos - List of selected DAOs
 * @returns {Promise<Object>} - The response containing proposals with AI decisions
 */
export const fetchProposals = async (
  chatHistory: string[],
  selectedDaos: string[]
): Promise<FetchProposalsResponse> => {
  try {
    const response = await axios.post<FetchProposalsResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/proposals`,
      {
        chatHistory: JSON.stringify(chatHistory),
        selectedDaos,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
};
