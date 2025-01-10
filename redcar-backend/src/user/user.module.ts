import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),  // Load environment variables globally
    TypeOrmModule.forFeature([User]),  // Import the User entity for TypeORM
    JwtModule.registerAsync({
      imports: [ConfigModule],  // Ensure ConfigModule is available
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),  // Get the JWT_SECRET from env variables
        signOptions: { expiresIn: '1h' },  // Set token expiration time
      }),
      inject: [ConfigService],  // Inject ConfigService to access environment variables
    }),
  ],
  controllers: [UserController],  // Register the controller
  providers: [
    UserService,
    AuthService,
    JwtStrategy,  // Include the JWT strategy for authentication
  ],
  exports: [UserService],  // Optionally export the UserService for use in other modules
})
export class UserModule {}