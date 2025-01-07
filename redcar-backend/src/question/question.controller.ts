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

    try {
      const result = await model.generateContentStream(prompt);

      // Iterate over chunks and push them to the readable stream
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log('Received chunk:', chunkText);  // Log each chunk for debugging
        stream.push(chunkText);  // Push chunk text to the stream
      }

      stream.push(null);  // Signal the end of the stream
    } catch (error) {
      console.error('Error calling Google Gemini:', error.message);
      stream.emit('error', error);  // Emit error on the stream
    }

    // Return the observable which will be used to push the data to the client via SSE
    return new Observable<MessageEvent>((subscriber) => {
      // Stream the data to the subscriber (client)
      stream.on('data', (chunk) => {
        console.log('Controller received chunk:', chunk.toString());
        subscriber.next(
          new MessageEvent('message', { data: chunk.toString() })
        );
      });

      // When the stream ends, complete the SSE stream
      stream.on('end', () => {
        console.log('Controller received end event');
        subscriber.next(new MessageEvent('end', { data: 'Streaming complete' }));
        subscriber.complete();
      });

      // Handle errors and propagate them to the subscriber
      stream.on('error', (error) => {
        console.error('Controller stream error:', error);
        subscriber.error(error);
      });
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