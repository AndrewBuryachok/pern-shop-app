import { Controller, Get } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { Market } from './market.entity';

@Controller('markets')
export class MarketsController {
  constructor(private marketsService: MarketsService) {}

  @Get()
  getMainMarkets(): Promise<Market[]> {
    return this.marketsService.getMainMarkets();
  }

  @Get('my')
  getMyMarkets(myId: number): Promise<Market[]> {
    return this.marketsService.getMyMarkets(myId);
  }

  @Get('all')
  getAllMarkets(): Promise<Market[]> {
    return this.marketsService.getAllMarkets();
  }
}
