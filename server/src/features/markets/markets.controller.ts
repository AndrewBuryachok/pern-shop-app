import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MarketsService } from './markets.service';
import { Market } from './market.entity';
import { CreateMarketDto, EditMarketDto, MarketIdDto } from './market.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('markets')
export class MarketsController {
  constructor(private marketsService: MarketsService) {}

  @Get()
  getMainMarkets(@Query() req: Request): Promise<Response<Market>> {
    return this.marketsService.getMainMarkets(req);
  }

  @Get('my')
  getMyMarkets(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Market>> {
    return this.marketsService.getMyMarkets(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllMarkets(@Query() req: Request): Promise<Response<Market>> {
    return this.marketsService.getAllMarkets(req);
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
