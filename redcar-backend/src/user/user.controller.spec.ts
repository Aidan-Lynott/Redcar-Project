import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn(),
      createUser: jest.fn(),
      validateUser: jest.fn(),
    };

    const mockAuthService = {
      generateJwt: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('should throw error if username already exists', async () => {
      const existingUser = { username: 'testuser', password: 'password' };

      userService.findOne = jest.fn().mockResolvedValue(existingUser);

      try {
        await userController.register({ username: 'testuser', password: 'password' });
      } catch (error) {
        expect(error.response).toBe('Username already exists');
        expect(error.status).toBe(HttpStatus.CONFLICT);
      }
    });

    it('should register a new user successfully', async () => {
      const newUser = { id: 1, username: 'testuser', password: 'password' };
      userService.findOne = jest.fn().mockResolvedValue(null); // No existing user
      userService.createUser = jest.fn().mockResolvedValue(newUser);

      const result = await userController.register({ username: 'testuser', password: 'password' });

      expect(result).toEqual({ message: 'User registered successfully', userId: 1 });
    });
  });

  describe('login', () => {
    it('should throw error if credentials are invalid', async () => {
      const user = null; // No user found
      userService.validateUser = jest.fn().mockResolvedValue(user);

      try {
        await userController.login({ username: 'testuser', password: 'wrongpassword' });
      } catch (error) {
        expect(error.response).toBe('Invalid credentials');
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });

    it('should return a token if credentials are valid', async () => {
      const user = { id: 1, username: 'testuser', password: 'password' };
      const token = 'some-jwt-token';
      userService.validateUser = jest.fn().mockResolvedValue(user);
      authService.generateJwt = jest.fn().mockResolvedValue(token);

      const result = await userController.login({ username: 'testuser', password: 'password' });

      expect(result).toEqual({ message: 'Login successful', token });
    });
  });

  describe('getProfile', () => {
    it('should return user profile if authenticated', async () => {
      const req = { user: { id: 1, username: 'testuser' } }; // Mocking authenticated user

      const result = await userController.getProfile(req);

      expect(result).toEqual({ message: 'Profile data', user: req.user });
    });
  });
});