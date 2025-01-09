import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const askQuestion = (question: string, domain: string) => {
    return axios.post(`${API_URL}/questions`, { question, domain });
};

// Send the question and result to the backend for storage
export const saveQuestionToDatabase = async (username: string, question: string, domain: string, result: string) => {
    await axios.post(`${API_URL}/questions`, { username, question, domain, result });
};

// Fetch user questions from the backend
export const getUserQuestionsFromDatabase = async (username: string) => {
    const response = await axios.get(`${API_URL}/questions?username=${username}`);
    return response.data;
};