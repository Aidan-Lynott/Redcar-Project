import { Controller, Post, Body } from '@nestjs/common';
import { GeminiAIService } from '../gemini/gemini.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly geminiAIService: GeminiAIService) {}

  @Post()
  async askQuestion(@Body() body: { question: string; domain: string }) {
    try {
      // Optional: you can provide additional context, for example, the domain
      const context = `Context for domain ${body.domain}`;
      
      const answer = await this.geminiAIService.askQuestion(body.question, context);
      return { result: answer };
    } catch (error) {
      return { result: 'Sorry, I could not retrieve an answer at the moment.' };
    }
  }
}