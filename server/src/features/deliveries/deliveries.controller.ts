import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { Delivery } from './delivery.entity';
import {
  CreateDeliveryDto,
  DeliveryIdDto,
  RateDeliveryDto,
  TakeDeliveryDto,
} from './delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
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

  @Roles(Role.MANAGER)
  @Get('all')
  getAllDeliveries(@Query() req: Request): Promise<Response<Delivery>> {
    return this.deliveriesService.getAllDeliveries(req);
  }

  @Post()
  createDelivery(
    @MyId() myId: number,
    @Body() dto: CreateDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.createDelivery({ ...dto, myId });
  }

  @Post(':deliveryId/take')
  takeDelivery(
    @MyId() myId: number,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: TakeDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.takeDelivery({ ...dto, deliveryId, myId });
  }

  @Delete(':deliveryId/take')
  untakeDelivery(
    @MyId() myId: number,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.untakeDelivery({ deliveryId, myId });
  }

  @Post(':deliveryId/execute')
  executeDelivery(
    @MyId() myId: number,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.executeDelivery({ deliveryId, myId });
  }

  @Post(':deliveryId')
  completeDelivery(
    @MyId() myId: number,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.completeDelivery({ deliveryId, myId });
  }

  @Delete(':deliveryId')
  deleteDelivery(
    @MyId() myId: number,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.deleteDelivery({ deliveryId, myId });
  }

  @Post(':deliveryId/rate')
  rateDelivery(
    @MyId() myId: number,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: RateDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.rateDelivery({ ...dto, deliveryId, myId });
  }
}
