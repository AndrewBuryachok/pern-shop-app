import { Controller, Get } from '@nestjs/common';
import { StoresService } from './stores.service';
import { Store } from './store.entity';

@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  getMainStores(): Promise<Store[]> {
    return this.storesService.getMainStores();
  }

  @Get('my')
  getMyStores(myId: number): Promise<Store[]> {
    return this.storesService.getMyStores(myId);
  }

  @Get('all')
  getAllStores(): Promise<Store[]> {
    return this.storesService.getAllStores();
  }
}
