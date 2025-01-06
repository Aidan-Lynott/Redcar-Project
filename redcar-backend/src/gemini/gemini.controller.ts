import { Module } from '@nestjs/common';
import { GeminiAIModule } from './gemini.module';  // Import the GeminiAIModule

@Module({
  imports: [GeminiAIModule],  // Add GeminiAIModule here
})
export class AppModule {}