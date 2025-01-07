import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/question.entity';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { GeminiAIService } from './gemini/gemini.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Question],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Question]), 
  ],
  controllers: [AppController, QuestionController], 
  providers: [AppService, GeminiAIService, QuestionService],
})
export class AppModule {}