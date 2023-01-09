import { Body, Controller, Get, Post } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from './store.entity';
import { CreateStoreDto } from './store.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  getMainStores(): Promise<Store[]> {
    return this.storesService.getMainStores();
  }

  @Get('my')
  getMyStores(@MyId() myId: number): Promise<Store[]> {
    return this.storesService.getMyStores(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllStores(): Promise<Store[]> {
    return this.storesService.getAllStores();
  }

  @Post()
  createStore(
    @MyId() myId: number,
    @Body() dto: CreateStoreDto,
  ): Promise<void> {
    return this.storesService.createStore({ ...dto, myId });
  }
}
