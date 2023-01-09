import { Controller, Get } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Shop } from './shop.entity';

@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  getMainShops(): Promise<Shop[]> {
    return this.shopsService.getMainShops();
  }

  @Get('my')
  getMyShops(myId: number): Promise<Shop[]> {
    return this.shopsService.getMyShops(myId);
  }

  @Get('all')
  getAllShops(): Promise<Shop[]> {
    return this.shopsService.getAllShops();
  }

  @Get('my/select')
  selectMyShops(myId: number): Promise<Shop[]> {
    return this.shopsService.selectMyShops(myId);
  }
}
