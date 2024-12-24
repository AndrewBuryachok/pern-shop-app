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
import { DeliveriesService } from './deliveries.service';
import { Delivery } from './delivery.entity';
import {
  CreateMarketDeliveryDto,
  CreateShopDeliveryDto,
  CreateStorageDeliveryDto,
  DeliveryIdDto,
  EditDeliveryDto,
  RateDeliveryDto,
  TakeDeliveryDto,
} from './delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Public()
  @Get()
  getMainDeliveries(@Query() req: Request): Promise<Response<Delivery>> {
    return this.deliveriesService.getMainDeliveries(req);
  }

  @Get('my')
  getMyDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getMyDeliveries(myId, req);
  }

  @Get('taken')
  getTakenDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getTakenDeliveries(myId, req);
  }

  @Get('placed')
  getPlacedDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getPlacedDeliveries(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllDeliveries(@Query() req: Request): Promise<Response<Delivery>> {
    return this.deliveriesService.getAllDeliveries(req);
  }

  @Post('shops')
  createShopDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateShopDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.createShopDelivery({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Post('markets')
  createMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateMarketDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.createMarketDelivery({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Post('storages')
  createStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateStorageDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.createStorageDelivery({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':deliveryId')
  editDelivery(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: EditDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.editDelivery({
      ...dto,
      deliveryId,
      myId,
      hasRole,
    });
  }

  @Post(':deliveryId/take')
  takeDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: TakeDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.takeDelivery({
      ...dto,
      deliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':deliveryId/take')
  untakeDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.untakeDelivery({
      deliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':deliveryId/execute')
  executeDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.executeDelivery({
      deliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':deliveryId')
  completeDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.completeDelivery({
      deliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':deliveryId')
  deleteDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.deleteDelivery({
      deliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':deliveryId/rate')
  rateDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: RateDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.rateDelivery({
      ...dto,
      deliveryId,
      myId,
      nick,
      hasRole,
    });
  }
}
