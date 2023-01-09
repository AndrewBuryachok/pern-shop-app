import { Body, Controller, Get, Post } from '@nestjs/common';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';
import { CreateTradeDto } from './trade.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Get('my')
  getMyTrades(@MyId() myId: number): Promise<Trade[]> {
    return this.tradesService.getMyTrades(myId);
  }

  @Get('placed')
  getPlacedTrades(@MyId() myId: number): Promise<Trade[]> {
    return this.tradesService.getPlacedTrades(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllTrades(): Promise<Trade[]> {
    return this.tradesService.getAllTrades();
  }

  @Post()
  createTrade(
    @MyId() myId: number,
    @Body() dto: CreateTradeDto,
  ): Promise<void> {
    return this.tradesService.createTrade({ ...dto, myId });
  }
}
