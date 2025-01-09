import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Mocking the bcrypt functions
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedpassword' };
      userRepository.findOne = jest.fn().mockResolvedValue(user);

      const result = await userService.findOne('testuser');
      expect(result).toEqual(user);
    });

    it('should return undefined if user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await userService.findOne('nonexistentuser');
      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should hash the password and save the user', async () => {
      const username = 'testuser';
      const password = 'password';
      const hashedPassword = 'hashedpassword';

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);
      const createUserDto = { username, password };

      const user = { id: 1, username, password: hashedPassword };
      userRepository.create = jest.fn().mockReturnValue(user);
      userRepository.save = jest.fn().mockResolvedValue(user);

      const result = await userService.createUser(username, password);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(userRepository.create).toHaveBeenCalledWith({ username, password: hashedPassword });
      expect(userRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('validateUser', () => {
    it('should return the user if password matches', async () => {
      const username = 'testuser';
      const password = 'password';
      const hashedPassword = 'hashedpassword';
      const user = { id: 1, username, password: hashedPassword };

      userRepository.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const result = await userService.validateUser(username, password);
      expect(result).toEqual(user);
    });

    it('should return null if password does not match', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const hashedPassword = 'hashedpassword';
      const user = { id: 1, username, password: hashedPassword };

      userRepository.findOne = jest.fn().mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const result = await userService.validateUser(username, password);
      expect(result).toBeNull();
    });

    it('should return null if user is not found', async () => {
      const username = 'nonexistentuser';
      const password = 'password';

      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      const result = await userService.validateUser(username, password);
      expect(result).toBeNull();
    });
  });
});