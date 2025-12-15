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
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import {
  CompleteOrderDto,
  CreateOrderDto,
  EditOrderDto,
  OrderIdDto,
  TakeOrderDto,
} from './order.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/orders')
@Controller(':project/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public()
  @Get()
  getMainOrders(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getMainOrders(project, req);
  }

  @Get('my')
  getMyOrders(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getMyOrders(project, myId, req);
  }

  @Get('taken')
  getTakenOrders(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getTakenOrders(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllOrders(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getAllOrders(project, req);
  }

  @Post()
  createOrder(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateOrderDto,
  ): Promise<void> {
    return this.ordersService.createOrder(project, { ...dto, myId, hasRole });
  }

  @Patch(':orderId')
  editOrder(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: EditOrderDto,
  ): Promise<void> {
    return this.ordersService.editOrder(project, {
      ...dto,
      orderId,
      myId,
      hasRole,
    });
  }

  @Post(':orderId/take')
  takeOrder(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: TakeOrderDto,
  ): Promise<void> {
    return this.ordersService.takeOrder(project, {
      ...dto,
      orderId,
      myId,
      hasRole,
    });
  }

  @Delete(':orderId/take')
  untakeOrder(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.untakeOrder(project, { orderId, myId, hasRole });
  }

  @Post(':orderId/execute')
  executeOrder(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.executeOrder(project, { orderId, myId, hasRole });
  }

  @Post(':orderId')
  completeOrder(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: CompleteOrderDto,
  ): Promise<void> {
    return this.ordersService.completeOrder(project, {
      ...dto,
      orderId,
      myId,
      hasRole,
    });
  }

  @Delete(':orderId')
  deleteOrder(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.deleteOrder(project, { orderId, myId, hasRole });
  }
}
