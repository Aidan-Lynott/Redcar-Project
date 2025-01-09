import { JwtStrategy } from './jwt.strategy';
import { UserService } from '../user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService: UserService;

  beforeAll(() => {
    process.env.JWT_SECRET = 'secretKey'; // Set JWT_SECRET for the test
  });

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn(), // Mock findOne method
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('should validate and return user data if user exists', async () => {
    // Arrange: Mock user service to return a user
    const payload = { username: 'testuser', sub: 1 };
    const mockUser = { id: 1, username: 'testuser', password: 'hashedPassword' };
    userService.findOne = jest.fn().mockResolvedValue(mockUser);

    // Act: Call validate method with the payload
    const result = await jwtStrategy.validate(payload);

    // Assert: Check if user data is returned correctly
    expect(result).toEqual({ userId: payload.sub, username: payload.username });
    expect(userService.findOne).toHaveBeenCalledWith(payload.username);
  });

  it('should throw Error if user is not found', async () => {
    // Arrange: Mock user service to return null
    const payload = { username: 'nonexistentuser', sub: 2 };
    userService.findOne = jest.fn().mockResolvedValue(null);
  
    // Act & Assert: Ensure Error is thrown
    await expect(jwtStrategy.validate(payload)).rejects.toThrowError('User not found');
  });
});