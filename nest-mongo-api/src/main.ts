import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Enable CORS (for frontend integration)
  app.enableCors();

  // ✅ Global Validation (DTO validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra fields
      forbidNonWhitelisted: false, // throw error if extra fields
      transform: true, // auto transform types
    }),
  );

  // ✅ Serve uploaded images
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Server running on http://localhost:3000`);
}
bootstrap();