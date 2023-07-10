import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';
import { CreateTradeDto, RateTradeDto, TradeIdDto } from './trade.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('trades')
@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Public()
  @Get('stats')
  getTradesStats(): Promise<Stats> {
    return this.tradesService.getTradesStats();
  }

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

  @Post(':tradeId/rate')
  rateTrade(
    @MyId() myId: number,
    @Param() { tradeId }: TradeIdDto,
    @Body() dto: RateTradeDto,
  ): Promise<void> {
    return this.tradesService.rateTrade({ ...dto, tradeId, myId });
  }
}
