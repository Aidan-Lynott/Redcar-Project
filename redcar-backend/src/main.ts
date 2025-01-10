import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3001;  // Use the dynamic port from environment variable, fallback to 3001 for local
  await app.listen(port);  // Listen on the dynamic port
}
bootstrap();
