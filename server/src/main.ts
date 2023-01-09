import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AtGuard, RolesGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalGuards(
    new AtGuard(new Reflector()),
    new RolesGuard(new Reflector()),
  );
  await app.listen(3000);
}
bootstrap();
