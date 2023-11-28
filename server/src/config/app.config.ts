import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { AtGuard, RolesGuard } from '../common/guards';

export const appConfig = (app: INestApplication) => {
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
};
