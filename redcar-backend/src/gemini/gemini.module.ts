import { Module } from '@nestjs/common';
import { GeminiAIService } from './gemini.service'; // Path to your service

@Module({
  providers: [GeminiAIService],  // Register the service
  exports: [GeminiAIService],    // Export the service to be used in other modules
})
export class GeminiAIModule {}