import { Controller, Sse, Query, Post, Body, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GeminiAIService } from '../gemini/gemini.service';
import { QuestionService } from './question.service';
import { Question } from './question.entity';
import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Controller('questions')
export class QuestionController {

  private readonly apiKey: string;

  constructor(
    private readonly questionService: QuestionService
  ) {
    this.apiKey = process.env.GEMINI_API_KEY; // Ensure your .env file is correctly set up
    console.log(process.env.GEMINI_API_KEY);  // Log for debugging (you may want to remove this in production)
  }

  @Sse('stream')
  async streamQuestion(@Query('question') question: string, @Query('domain') domain: string): Promise<Observable<MessageEvent>> {
    const context = `Context for domain ${domain}`;

    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = question;

    // Create a readable stream
    const stream = new Readable({
      read() {},  // Necessary to avoid "not implemented" error
    });

    // Create an Observable to handle SSE streaming
    return new Observable<MessageEvent>((subscriber) => {
      (async () => {
        try {
          // Await the promise to get the result
          const result = await model.generateContentStream(prompt);  // Await here to get the stream

          // Iterate over chunks and push them to the SSE client as soon as they are received
          for await (const chunk of result.stream) {  // Access 'stream' after awaiting the result
            const chunkText = chunk.text();
            console.log('Received chunk:', chunkText);  // Log for debugging

            // Push chunk to the SSE client immediately
            subscriber.next(new MessageEvent('message', { data: chunkText }));
          }

          // When the stream ends, complete the SSE stream
          subscriber.next(new MessageEvent('end', { data: 'Streaming complete' }));
          subscriber.complete();
        } catch (error) {
          console.error('Error calling Google Gemini:', error.message);
          subscriber.error(error);  // Propagate error to SSE client
        }
      })();  // Call the async function immediately
    });
  }

  // Endpoint to save a new question and result
  @Post()
  async addQuestion(
    @Body('question') question: string,
    @Body('domain') domain: string,
    @Body('result') result: string,
  ): Promise<Question> {
    return this.questionService.addQuestion(question, domain, result);
  }

  // Endpoint to fetch all questions and results
  @Get()
  async getAllQuestions(): Promise<Question[]> {
    return this.questionService.getAllQuestions();
  }
}