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
  CompleteDeliveryDto,
  CreateDeliveryDto,
  DeliveryIdDto,
  EditDeliveryDto,
  TakeDeliveryDto,
} from './delivery.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/deliveries')
@Controller(':project/deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  @Public()
  @Get()
  getMainDeliveries(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getMainDeliveries(project, req);
  }

  @Get('my')
  getMyDeliveries(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getMyDeliveries(project, myId, req);
  }

  @Get('taken')
  getTakenDeliveries(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getTakenDeliveries(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllDeliveries(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getAllDeliveries(project, req);
  }

  @Post()
  createDelivery(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.createDelivery(project, {
      ...dto,
      myId,
      hasRole,
    });
  }

  @Patch(':deliveryId')
  editDelivery(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: EditDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.editDelivery(project, {
      ...dto,
      deliveryId,
      myId,
      hasRole,
    });
  }

  @Post(':deliveryId/take')
  takeDelivery(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: TakeDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.takeDelivery(project, {
      ...dto,
      deliveryId,
      myId,
      hasRole,
    });
  }

  @Delete(':deliveryId/take')
  untakeDelivery(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.untakeDelivery(project, {
      deliveryId,
      myId,
      hasRole,
    });
  }

  @Post(':deliveryId/execute')
  executeDelivery(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.executeDelivery(project, {
      deliveryId,
      myId,
      hasRole,
    });
  }

  @Post(':deliveryId')
  completeDelivery(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: CompleteDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.completeDelivery(project, {
      ...dto,
      deliveryId,
      myId,
      hasRole,
    });
  }

  @Delete(':deliveryId')
  deleteDelivery(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.deliveriesService.deleteDelivery(project, {
      deliveryId,
      myId,
      hasRole,
    });
  }
}
