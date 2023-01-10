import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';
import { CreateTradeDto } from './trade.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Get('my')
  getMyTrades(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Trade>> {
    return this.tradesService.getMyTrades(myId, req);
  }

  @Get('placed')
  getPlacedTrades(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Trade>> {
    return this.tradesService.getPlacedTrades(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllTrades(@Query() req: Request): Promise<Response<Trade>> {
    return this.tradesService.getAllTrades(req);
  }

  @Post()
  createTrade(
    @MyId() myId: number,
    @Body() dto: CreateTradeDto,
  ): Promise<void> {
    return this.tradesService.createTrade({ ...dto, myId });
  }
}
