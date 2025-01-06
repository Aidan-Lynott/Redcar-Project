import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async generateResponse(question: string, domain: string): Promise<string> {
    try {
      const prompt = `Answer this question based on the company ${domain}: ${question}`;
      const response = await this.openai.createCompletion({
        model: 'gpt-4o-mini',
        prompt,
        max_tokens: 150,
        temperature: 0.7,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate a response'); 
    }
  }
}