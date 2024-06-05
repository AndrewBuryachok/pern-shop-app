import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0];
    if (ip) {
      this.loggerService.addIp(ip);
    }
    next();
  }
}
