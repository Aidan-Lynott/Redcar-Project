import { Controller, Post, Body, UseGuards, Get, Req, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const existingUser = await this.userService.findOne(body.username);
    if (existingUser) {
      throw new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    const newUser = await this.userService.createUser(body.username, body.password);
    return { message: 'User registered successfully', userId: newUser.id };
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.userService.validateUser(body.username, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.authService.generateJwt(user);
    return { message: 'Login successful', token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    return { message: 'Profile data', user: req.user };
  }
}