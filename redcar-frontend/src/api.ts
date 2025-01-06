import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const askQuestion = (question: string, domain: string) => {
  return axios.post(`${API_URL}/questions`, { question, domain });
};