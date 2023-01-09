import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { Market } from './market.entity';
import { CreateMarketDto, EditMarketDto, MarketIdDto } from './market.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('markets')
export class MarketsController {
  constructor(private marketsService: MarketsService) {}

  @Get()
  getMainMarkets(): Promise<Market[]> {
    return this.marketsService.getMainMarkets();
  }

  @Get('my')
  getMyMarkets(@MyId() myId: number): Promise<Market[]> {
    return this.marketsService.getMyMarkets(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllMarkets(): Promise<Market[]> {
    return this.marketsService.getAllMarkets();
  }

  @Get('my/select')
  selectMyMarkets(@MyId() myId: number): Promise<Market[]> {
    return this.marketsService.selectMyMarkets(myId);
  }

  @Post()
  createMarket(
    @MyId() myId: number,
    @Body() dto: CreateMarketDto,
  ): Promise<void> {
    return this.marketsService.createMarket({ ...dto, myId });
  }

  @Patch(':marketId')
  editMarket(
    @MyId() myId: number,
    @Param() { marketId }: MarketIdDto,
    @Body() dto: EditMarketDto,
  ): Promise<void> {
    return this.marketsService.editMarket({ ...dto, marketId, myId });
  }
}
