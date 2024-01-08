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
import { ShopsService } from './shops.service';
import { Shop } from './shop.entity';
import { Good } from '../goods/good.entity';
import {
  CreateShopDto,
  EditShopDto,
  ExtCreateShopDto,
  ShopIdDto,
} from './shop.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('shops')
@Controller('shops')
export class ShopsController {
  constructor(private shopsService: ShopsService) {}

  @Public()
  @Get()
  getMainShops(@Query() req: Request): Promise<Response<Shop>> {
    return this.shopsService.getMainShops(req);
  }

  @Get('my')
  getMyShops(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Shop>> {
    return this.shopsService.getMyShops(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllShops(@Query() req: Request): Promise<Response<Shop>> {
    return this.shopsService.getAllShops(req);
  }

  @Public()
  @Get('all/select')
  selectAllShops(): Promise<Shop[]> {
    return this.shopsService.selectAllShops();
  }

  @Get('my/select')
  selectMyShops(@MyId() myId: number): Promise<Shop[]> {
    return this.shopsService.selectMyShops(myId);
  }

  @Public()
  @Get(':shopId/goods')
  selectShopGoods(@Param() { shopId }: ShopIdDto): Promise<Good[]> {
    return this.shopsService.selectShopGoods(shopId);
  }

  @Post()
  createMyShop(
    @MyId() myId: number,
    @Body() dto: CreateShopDto,
  ): Promise<void> {
    return this.shopsService.createShop({ ...dto, userId: myId });
  }

  @Roles(Role.MANAGER)
  @Post('all')
  createUserShop(@Body() dto: ExtCreateShopDto): Promise<void> {
    return this.shopsService.createShop(dto);
  }

  @Patch(':shopId')
  editShop(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { shopId }: ShopIdDto,
    @Body() dto: EditShopDto,
  ): Promise<void> {
    return this.shopsService.editShop({ ...dto, shopId, myId, hasRole });
  }
}
