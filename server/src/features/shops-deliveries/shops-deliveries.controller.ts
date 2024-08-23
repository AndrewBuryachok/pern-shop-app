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
import { ShopsDeliveriesService } from './shops-deliveries.service';
import { ShopDelivery } from './shop-delivery.entity';
import {
  CreateShopDeliveryDto,
  EditShopDeliveryDto,
  ShopDeliveryIdDto,
  RateShopDeliveryDto,
  TakeShopDeliveryDto,
} from './shop-delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('shops-deliveries')
@Controller('shops-deliveries')
export class ShopsDeliveriesController {
  constructor(private shopsDeliveriesService: ShopsDeliveriesService) {}

  @Public()
  @Get()
  getMainShopsDeliveries(
    @Query() req: Request,
  ): Promise<Response<ShopDelivery>> {
    return this.shopsDeliveriesService.getMainShopsDeliveries(req);
  }

  @Get('my')
  getMyShopsDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<ShopDelivery>> {
    return this.shopsDeliveriesService.getMyShopsDeliveries(myId, req);
  }

  @Get('taken')
  getTakenShopsDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<ShopDelivery>> {
    return this.shopsDeliveriesService.getTakenShopsDeliveries(myId, req);
  }

  @Get('placed')
  getPlacedShopsDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<ShopDelivery>> {
    return this.shopsDeliveriesService.getPlacedShopsDeliveries(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllShopsDeliveries(
    @Query() req: Request,
  ): Promise<Response<ShopDelivery>> {
    return this.shopsDeliveriesService.getAllShopsDeliveries(req);
  }

  @Post()
  createShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateShopDeliveryDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.createShopDelivery({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':shopDeliveryId')
  editShopDelivery(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { shopDeliveryId }: ShopDeliveryIdDto,
    @Body() dto: EditShopDeliveryDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.editShopDelivery({
      ...dto,
      shopDeliveryId,
      myId,
      hasRole,
    });
  }

  @Post(':shopDeliveryId/take')
  takeShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { shopDeliveryId }: ShopDeliveryIdDto,
    @Body() dto: TakeShopDeliveryDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.takeShopDelivery({
      ...dto,
      shopDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':shopDeliveryId/take')
  untakeShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { shopDeliveryId }: ShopDeliveryIdDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.untakeShopDelivery({
      shopDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':shopDeliveryId/execute')
  executeShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { shopDeliveryId }: ShopDeliveryIdDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.executeShopDelivery({
      shopDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':shopDeliveryId')
  completeShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { shopDeliveryId }: ShopDeliveryIdDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.completeShopDelivery({
      shopDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':shopDeliveryId')
  deleteShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { shopDeliveryId }: ShopDeliveryIdDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.deleteShopDelivery({
      shopDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':shopDeliveryId/rate')
  rateShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { shopDeliveryId }: ShopDeliveryIdDto,
    @Body() dto: RateShopDeliveryDto,
  ): Promise<void> {
    return this.shopsDeliveriesService.rateShopDelivery({
      ...dto,
      shopDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }
}
