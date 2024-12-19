import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StallsService } from './stalls.service';
import { Stall } from './stall.entity';
import { MarketTag } from '../markets-tags/market-tag.entity';
import { CreateStallDto, StallIdDto } from './stall.dto';
import { MarketIdDto } from '../markets/market.dto';
import { MarketTagIdDto } from '../markets-tags/market-tag.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('stalls')
@Controller('stalls')
export class StallsController {
  constructor(private stallsService: StallsService) {}

  @Public()
  @Get()
  getMainStalls(@Query() req: Request): Promise<Response<Stall>> {
    return this.stallsService.getMainStalls(req);
  }

  @Get('my')
  getMyStalls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Stall>> {
    return this.stallsService.getMyStalls(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllStalls(@Query() req: Request): Promise<Response<Stall>> {
    return this.stallsService.getAllStalls(req);
  }

  @Public()
  @Get(':marketId/markets')
  selectMarketStalls(@Param() { marketId }: MarketIdDto): Promise<Stall[]> {
    return this.stallsService.selectMarketStalls(marketId);
  }

  @Public()
  @Get(':marketTagId/tags')
  selectTagStalls(@Param() { marketTagId }: MarketTagIdDto): Promise<Stall[]> {
    return this.stallsService.selectTagStalls(marketTagId);
  }

  @Public()
  @Get(':stallId/tag')
  selectStallTag(@Param() { stallId }: StallIdDto): Promise<MarketTag> {
    return this.stallsService.selectStallTag(stallId);
  }

  @Post()
  createStall(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateStallDto,
  ): Promise<void> {
    return this.stallsService.createStall({ ...dto, myId, hasRole });
  }
}
