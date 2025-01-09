import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  // Method to add a new question and result to the database
  async addQuestion(username: string, question: string, domain: string, result: string): Promise<Question> {
    const newQuestion = this.questionRepository.create({ username, question, domain, result });
    return this.questionRepository.save(newQuestion);
  }

  // Method to retrieve questions for a specific user from the database
  async getUserQuestions(username: string): Promise<Question[]> {
    return this.questionRepository.find({ where: { username } });
  }
}