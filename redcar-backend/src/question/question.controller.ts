import { Controller, Sse, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GeminiAIService } from '../gemini/gemini.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly geminiAIService: GeminiAIService) {}

  @Sse('stream')
  async streamQuestion(@Query('question') question: string, @Query('domain') domain: string): Promise<Observable<MessageEvent>> {
    const context = `Context for domain ${domain}`;

    const stream = await this.geminiAIService.askQuestionStream(question, context);

    return new Observable((subscriber) => {
      stream.on('data', (chunk) => {
        console.log('Controller received chunk:', chunk.toString());
        subscriber.next(
          new MessageEvent('message', { data: chunk.toString() })
        );
      });

      stream.on('end', () => {
        console.log('Controller received end event');
        subscriber.next(new MessageEvent('end', { data: 'Streaming complete' }));
        subscriber.complete();
      });

      stream.on('error', (error) => {
        console.error('Controller stream error:', error);
        subscriber.error(error);
      });
    });
  }
}