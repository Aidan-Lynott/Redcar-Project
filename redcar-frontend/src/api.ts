import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const askQuestion = (question: string, domain: string) => {
    return axios.post(`${API_URL}/questions`, { question, domain });
};

// Send the question and result to the backend for storage
export const saveQuestionToDatabase = async (question: string, domain: string, result: string) => {
    await axios.post(`${API_URL}/questions`, { question, domain, result });
};

// Fetch all questions from the backend
export const getAllQuestionsFromDatabase = async () => {
    const response = await axios.get(`${API_URL}/questions`);
    return response.data;
};