import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('questions')
export class QuestionController {
  @Post()
  askQuestion(@Body() body: { question: string; domain: string }) {
    return { result: `This is a mock response for: ${body.question}` };
  }
}