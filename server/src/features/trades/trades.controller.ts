import { Body, Controller, Get, Post } from '@nestjs/common';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';
import { CreateTradeDto } from './trade.dto';

@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Get('my')
  getMyTrades(myId: number): Promise<Trade[]> {
    return this.tradesService.getMyTrades(myId);
  }

  @Get('placed')
  getPlacedTrades(myId: number): Promise<Trade[]> {
    return this.tradesService.getPlacedTrades(myId);
  }

  @Get('all')
  getAllTrades(): Promise<Trade[]> {
    return this.tradesService.getAllTrades();
  }

  @Post()
  createTrade(myId: number, @Body() dto: CreateTradeDto): Promise<void> {
    return this.tradesService.createTrade({ ...dto, myId });
  }
}
