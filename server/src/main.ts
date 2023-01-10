import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(+process.env.APP_PORT);
}
bootstrap();
