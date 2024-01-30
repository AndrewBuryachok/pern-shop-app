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
import { MarketsService } from './markets.service';
import { Market } from './market.entity';
import { MarketState } from './market-state.entity';
import { CreateMarketDto, EditMarketDto, MarketIdDto } from './market.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private marketsService: MarketsService) {}

  @Public()
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

  @Public()
  @Get('main/select')
  selectMainMarkets(): Promise<Market[]> {
    return this.marketsService.selectMainMarkets();
  }

  @Get('my/select')
  selectMyMarkets(@MyId() myId: number): Promise<Market[]> {
    return this.marketsService.selectMyMarkets(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all/select')
  selectAllMarkets(): Promise<Market[]> {
    return this.marketsService.selectAllMarkets();
  }

  @Public()
  @Get(':marketId/states')
  selectMarketStates(
    @Param() { marketId }: MarketIdDto,
  ): Promise<MarketState[]> {
    return this.marketsService.selectMarketStates(marketId);
  }

  @Post()
  createMarket(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateMarketDto,
  ): Promise<void> {
    return this.marketsService.createMarket({ ...dto, myId, nick, hasRole });
  }

  @Patch(':marketId')
  editMarket(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { marketId }: MarketIdDto,
    @Body() dto: EditMarketDto,
  ): Promise<void> {
    return this.marketsService.editMarket({ ...dto, marketId, myId, hasRole });
  }
}
