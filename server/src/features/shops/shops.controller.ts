import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Shop } from './shop.entity';
import { CreateShopDto, EditShopDto, ShopIdDto } from './shop.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Get()
  getMainShops(): Promise<Shop[]> {
    return this.shopsService.getMainShops();
  }

  @Get('my')
  getMyShops(@MyId() myId: number): Promise<Shop[]> {
    return this.shopsService.getMyShops(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllShops(): Promise<Shop[]> {
    return this.shopsService.getAllShops();
  }

  @Get('my/select')
  selectMyShops(@MyId() myId: number): Promise<Shop[]> {
    return this.shopsService.selectMyShops(myId);
  }

  @Post()
  createShop(@MyId() myId: number, @Body() dto: CreateShopDto): Promise<void> {
    return this.shopsService.createShop({ ...dto, myId });
  }

  @Patch(':shopId')
  editShop(
    @MyId() myId: number,
    @Param() { shopId }: ShopIdDto,
    @Body() dto: EditShopDto,
  ): Promise<void> {
    return this.shopsService.editShop({ ...dto, shopId, myId });
  }
}
