import { Controller, Post, Body } from '@nestjs/common';
import { OpenAiService } from '../openai/openai.service'; // Import the OpenAiService

@Controller('questions')
export class QuestionController {
  // Inject OpenAiService into the constructor
  constructor(private readonly openAiService: OpenAiService) {}

  @Post()
  async askQuestion(@Body() body: { question: string; domain: string }) {
    const { question, domain } = body;

    try {
      // Use the OpenAiService to get a response
      const result = await this.openAiService.generateResponse(question, domain);
      
      // Return the result
      return { result };
    } catch (error) {
      // Handle error if the OpenAI API request fails
      return { error: 'Failed to generate response' };
    }
  }
}