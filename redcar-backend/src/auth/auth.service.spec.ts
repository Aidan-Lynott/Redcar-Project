import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

// Mock the JwtService
const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockJwtToken'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService }, 
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should generate a JWT token', async () => {
    // Given a mock user
    const mockUser: User = { id: 1, username: 'testuser', password: 'mockPassword' };
  
    // When generateJwt is called
    const result = await authService.generateJwt(mockUser);
  
    // Then JwtService sign method should be called with the correct payload
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: mockUser.username,
      sub: mockUser.id,
    });
  
    // And the result should be the mocked JWT token
    expect(result).toBe('mockJwtToken');
  });
});