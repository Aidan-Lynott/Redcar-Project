import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question/question.entity';
import { QuestionController } from './question/question.controller';
import { QuestionService } from './question/question.service';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Ensure it's globally available
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Question, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Question, User]),
    UserModule, // Ensure this is inside the imports array
  ],
  controllers: [AppController, QuestionController],
  providers: [AppService, QuestionService],
})
export class AppModule {}