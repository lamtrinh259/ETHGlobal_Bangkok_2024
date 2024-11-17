import axios from "axios";

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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions`,
      {
        params: { selectedDaos },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
