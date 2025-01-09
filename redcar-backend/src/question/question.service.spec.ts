import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let questionRepository: Repository<Question>;

  beforeEach(async () => {
    const mockQuestionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: getRepositoryToken(Question), useValue: mockQuestionRepository },
      ],
    }).compile();

    questionService = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<Repository<Question>>(getRepositoryToken(Question));
  });

  it('should be defined', () => {
    expect(questionService).toBeDefined();
  });

  describe('addQuestion', () => {
    it('should create and save a new question', async () => {
      // Arrange: Define input values and mock behavior
      const username = 'testuser';
      const question = 'What is NestJS?';
      const domain = 'NestJS';
      const result = 'A framework for building server-side applications';
      const mockQuestion = { username, question, domain, result };
  
      // Mock the repository methods
      questionRepository.create = jest.fn().mockReturnValue(mockQuestion);
      questionRepository.save = jest.fn().mockResolvedValue(mockQuestion);
  
      // Act: Call the addQuestion method
      const result2 = await questionService.addQuestion(username, question, domain, result);
  
      // Assert: Check if the question was saved and returned
      // Updated to match the correct object structure with 'result' instead of 'result2'
      expect(questionRepository.create).toHaveBeenCalledWith({ username, question, domain, result });
      expect(questionRepository.save).toHaveBeenCalledWith(mockQuestion);
      expect(result2).toEqual(mockQuestion);
    });
  });  

  describe('getUserQuestions', () => {
    it('should return an array of questions for a given user', async () => {
      // Arrange: Define the username and mock questions
      const username = 'testuser';
      const mockQuestions = [
        { username, question: 'What is Node.js?', domain: 'Node.js', result: 'JavaScript runtime' },
        { username, question: 'What is Express?', domain: 'Node.js', result: 'Web framework for Node.js' },
      ];

      // Mock the repository method
      questionRepository.find = jest.fn().mockResolvedValue(mockQuestions);

      // Act: Call getUserQuestions method
      const result = await questionService.getUserQuestions(username);

      // Assert: Check if the correct questions are returned
      expect(questionRepository.find).toHaveBeenCalledWith({ where: { username } });
      expect(result).toEqual(mockQuestions);
    });

    it('should return an empty array if no questions found', async () => {
      // Arrange: Define the username
      const username = 'nonexistentuser';
      const mockQuestions: Question[] = [];

      // Mock the repository method
      questionRepository.find = jest.fn().mockResolvedValue(mockQuestions);

      // Act: Call getUserQuestions method
      const result = await questionService.getUserQuestions(username);

      // Assert: Check if an empty array is returned
      expect(questionRepository.find).toHaveBeenCalledWith({ where: { username } });
      expect(result).toEqual(mockQuestions);
    });
  });
});