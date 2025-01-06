import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class GeminiAIService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY; // Ensure your .env file is correctly set up
    console.log(process.env.GEMINI_API_KEY);
  }

  async askQuestion(question: string, context?: string): Promise<string> {

    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = question;

    try {

      const { GoogleGenerativeAI } = require("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = question;

      const result = await model.generateContent(prompt);
      console.log(result.response.text());
      return result.response.text();

    } catch (error) {
      console.error('Error calling Google Gemini:', error.message);
      throw new Error('Failed to get a response from Google Gemini');
    }
  }
}

