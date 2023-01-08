import { Controller, Get } from '@nestjs/common';
import { TradesService } from './trades.service';
import { Trade } from './trade.entity';

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
}
