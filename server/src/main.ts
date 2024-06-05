import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  morgan.token('user', (req) => req.user?.nick);
  app.use(
    morgan(
      ':user :method :url :status :res[content-length] - :response-time ms',
    ),
  );
  appConfig(app);
  const config = new DocumentBuilder()
    .setTitle('Shop API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(+process.env.APP_PORT);
}
bootstrap();
