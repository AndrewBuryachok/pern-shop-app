import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShopsService } from './shops.service';
import { Shop } from './shop.entity';
import { User } from '../users/user.entity';
import { Good } from '../goods/good.entity';
import {
  CreateShopDto,
  EditShopDto,
  ExtCreateShopDto,
  ShopIdDto,
  UpdateShopUserDto,
} from './shop.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
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
  @Get(':shopId/users')
  selectShopUsers(@Param() { shopId }: ShopIdDto): Promise<User[]> {
    return this.shopsService.selectShopUsers(shopId);
  }

  @Public()
  @Get(':shopId/goods')
  selectShopGoods(@Param() { shopId }: ShopIdDto): Promise<Good[]> {
    return this.shopsService.selectShopGoods(shopId);
  }

  @Post()
  createMyShop(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateShopDto,
  ): Promise<void> {
    return this.shopsService.createShop({ ...dto, userId: myId, nick });
  }

  @Roles(Role.MANAGER)
  @Post('all')
  createUserShop(
    @MyNick() nick: string,
    @Body() dto: ExtCreateShopDto,
  ): Promise<void> {
    return this.shopsService.createShop({ ...dto, nick });
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

  @Post(':shopId/users')
  addShopUser(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { shopId }: ShopIdDto,
    @Body() dto: UpdateShopUserDto,
  ): Promise<void> {
    return this.shopsService.addShopUser({
      ...dto,
      shopId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':shopId/users')
  removeShopUser(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { shopId }: ShopIdDto,
    @Body() dto: UpdateShopUserDto,
  ): Promise<void> {
    return this.shopsService.removeShopUser({
      ...dto,
      shopId,
      myId,
      nick,
      hasRole,
    });
  }
}
