import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiAIService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY; // Ensure your .env file is correctly set up
    console.log(process.env.GEMINI_API_KEY);
  }

  async askQuestionStream(question: string, context?: string): Promise<Readable> {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = question;

    // Create a readable stream
    const stream = new Readable({
      read() {}, // Necessary to avoid "not implemented" errors
    });

    try {
      const result = await model.generateContentStream(prompt);

      // Iterate over chunks and push them to the readable stream
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log('Received chunk:', chunkText); // Log each chunk for debugging
        stream.push(chunkText); // Push chunk text to the stream
      }

      stream.push(null); // Signal that the stream is complete
    } catch (error) {
      console.error('Error calling Google Gemini:', error.message);
      stream.emit('error', error); // Emit error on the stream
    }

    return stream;
  }
}

