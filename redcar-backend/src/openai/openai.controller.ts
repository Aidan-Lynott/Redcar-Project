import { Module } from '@nestjs/common';
import { OpenAiModule } from './openai.module';  // Import the OpenAiModule

@Module({
  imports: [OpenAiModule],  // Add OpenAiModule here
})
export class AppModule {}