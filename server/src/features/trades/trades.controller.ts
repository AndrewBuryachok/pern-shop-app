import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';
import { CreateTradeDto, RateTradeDto, TradeIdDto } from './trade.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('trades')
@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Public()
  @Get('stats')
  getTradesStats(): Promise<number> {
    return this.tradesService.getTradesStats();
  }

  @Get('my')
  getMyTrades(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Trade>> {
    return this.tradesService.getMyTrades(myId, req);
  }

  @Get('sold')
  getSoldTrades(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Trade>> {
    return this.tradesService.getSoldTrades(myId, req);
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
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateTradeDto,
  ): Promise<void> {
    return this.tradesService.createTrade({ ...dto, myId, nick, hasRole });
  }

  @Patch(':tradeId/rate')
  rateTrade(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { tradeId }: TradeIdDto,
    @Body() dto: RateTradeDto,
  ): Promise<void> {
    return this.tradesService.rateTrade({
      ...dto,
      tradeId,
      myId,
      nick,
      hasRole,
    });
  }
}
