import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionController } from './question/question.controller';

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
  providers: [AppService],
})
export class AppModule {}