import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Shop } from './shop.entity';
import { CreateShopDto, EditShopDto, ShopIdDto } from './shop.dto';

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

  @Post()
  createShop(myId: number, @Body() dto: CreateShopDto): Promise<void> {
    return this.shopsService.createShop({ ...dto, myId });
  }

  @Patch(':shopId')
  editShop(
    myId: number,
    @Param() { shopId }: ShopIdDto,
    @Body() dto: EditShopDto,
  ): Promise<void> {
    return this.shopsService.editShop({ ...dto, shopId, myId });
  }
}
