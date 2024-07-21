import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { MarketTag } from '../markets-tags/market-tag.entity';
import { CreateStoreDto, StoreIdDto } from './store.dto';
import { MarketIdDto } from '../markets/market.dto';
import { MarketTagIdDto } from '../markets-tags/market-tag.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Public()
  @Get()
  getMainStores(@Query() req: Request): Promise<Response<Store>> {
    return this.storesService.getMainStores(req);
  }

  @Get('my')
  getMyStores(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Store>> {
    return this.storesService.getMyStores(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllStores(@Query() req: Request): Promise<Response<Store>> {
    return this.storesService.getAllStores(req);
  }

  @Public()
  @Get(':marketId/markets')
  selectMarketStores(@Param() { marketId }: MarketIdDto): Promise<Store[]> {
    return this.storesService.selectMarketStores(marketId);
  }

  @Public()
  @Get(':marketTagId/tags')
  selectTagStores(@Param() { marketTagId }: MarketTagIdDto): Promise<Store[]> {
    return this.storesService.selectTagStores(marketTagId);
  }

  @Public()
  @Get(':storeId/tag')
  selectStoreTag(@Param() { storeId }: StoreIdDto): Promise<MarketTag> {
    return this.storesService.selectStoreTag(storeId);
  }

  @Post()
  createStore(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateStoreDto,
  ): Promise<void> {
    return this.storesService.createStore({ ...dto, myId, hasRole });
  }
}
