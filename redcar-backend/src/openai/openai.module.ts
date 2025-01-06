import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';

@Module({
  providers: [OpenAiService],
  exports: [OpenAiService],  // Export to use in other modules
})
export class OpenAiModule {}