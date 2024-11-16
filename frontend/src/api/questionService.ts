import axios from "axios";

const API_BASE_URL = "http://152.53.36.131:9999";

export interface Question {
  id: string;
  text: string;
}

export interface FetchQuestionsResponse {
  questions: Question[];
}

/**
 * Fetch questions based on the selected DAOs
 * @param {string[]} selectedDaos - List of selected DAOs
 * @returns {Promise<Object>} - The response containing questions
 */
export const fetchQuestions = async (
  selectedDaos: string[]
): Promise<FetchQuestionsResponse> => {
  try {
    const response = await axios.get<FetchQuestionsResponse>(
      `${API_BASE_URL}/questions`,
      {
        params: { selectedDaos: selectedDaos.join(",") },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
