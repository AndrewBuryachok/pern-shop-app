import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { Market } from './market.entity';
import { CreateMarketDto, EditMarketDto, MarketIdDto } from './market.dto';

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

  @Get('my/select')
  selectMyMarkets(myId: number): Promise<Market[]> {
    return this.marketsService.selectMyMarkets(myId);
  }

  @Post()
  createMarket(myId: number, @Body() dto: CreateMarketDto): Promise<void> {
    return this.marketsService.createMarket({ ...dto, myId });
  }

  @Patch(':marketId')
  editMarket(
    myId: number,
    @Param() { marketId }: MarketIdDto,
    @Body() dto: EditMarketDto,
  ): Promise<void> {
    return this.marketsService.editMarket({ ...dto, marketId, myId });
  }
}
