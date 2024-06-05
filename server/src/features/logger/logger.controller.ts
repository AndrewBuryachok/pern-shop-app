import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from './logger.service';
import { Log } from './log.entity';
import { Request } from '../../common/interfaces';
import { Public } from '../../common/decorators';

@ApiTags('logs')
@Controller('logs')
export class LoggerController {
  constructor(private loggerService: LoggerService) {}

  @Public()
  @Get('ip')
  getLogs(@Query() req: Request): Promise<Log[]> {
    return this.loggerService.getLogs(req);
  }

  @Public()
  @Post('ip')
  createLog(): Promise<void> {
    return this.loggerService.createLog();
  }
}
