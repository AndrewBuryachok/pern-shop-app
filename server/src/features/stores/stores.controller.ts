import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { CreateStoreDto } from './store.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('stores')
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

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

  @Roles(Role.MANAGER)
  @Get('all')
  getAllStores(@Query() req: Request): Promise<Response<Store>> {
    return this.storesService.getAllStores(req);
  }

  @Post()
  createStore(
    @MyId() myId: number,
    @Body() dto: CreateStoreDto,
  ): Promise<void> {
    return this.storesService.createStore({ ...dto, myId });
  }
}
