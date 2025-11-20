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
import { MarketsTagsService } from './markets-tags.service';
import { MarketTag } from './market-tag.entity';
import { MarketTagState } from './market-tag-state.entity';
import {
  CreateMarketTagDto,
  EditMarketTagDto,
  MarketTagIdDto,
} from './market-tag.dto';
import { MarketIdDto } from '../markets/market.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('markets-tags')
@Controller('markets-tags')
export class MarketsTagsController {
  constructor(private marketsTagsService: MarketsTagsService) {}

  @Public()
  @Get()
  getMainMarketsTags(@Query() req: Request): Promise<Response<MarketTag>> {
    return this.marketsTagsService.getMainMarketsTags(req);
  }

  @Get('my')
  getMyMarketsTags(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<MarketTag>> {
    return this.marketsTagsService.getMyMarketsTags(myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllMarketsTags(@Query() req: Request): Promise<Response<MarketTag>> {
    return this.marketsTagsService.getAllMarketsTags(req);
  }

  @Public()
  @Get(':marketId/select')
  selectMarketTags(@Param() { marketId }: MarketIdDto): Promise<MarketTag[]> {
    return this.marketsTagsService.selectMarketTags(marketId);
  }

  @Public()
  @Get(':marketTagId/states')
  selectMarketTagStates(
    @Param() { marketTagId }: MarketTagIdDto,
  ): Promise<MarketTagState[]> {
    return this.marketsTagsService.selectMarketTagStates(marketTagId);
  }

  @Post()
  createMarketTag(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateMarketTagDto,
  ): Promise<void> {
    return this.marketsTagsService.createMarketTag({
      ...dto,
      myId,
      hasRole,
    });
  }

  @Patch(':marketTagId')
  editMarketTag(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { marketTagId }: MarketTagIdDto,
    @Body() dto: EditMarketTagDto,
  ): Promise<void> {
    return this.marketsTagsService.editMarketTag({
      ...dto,
      marketTagId,
      myId,
      hasRole,
    });
  }
}
