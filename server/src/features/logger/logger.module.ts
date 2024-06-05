import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude('(auth|mqtt|logs)/(.*)')
      .forRoutes('*');
  }
}
