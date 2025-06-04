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
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Public()
  @Get()
  getMainOrders(@Query() req: Request): Promise<Response<Order>> {
    return this.ordersService.getMainOrders(req);
  }

  @Get('my')
  getMyOrders(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getMyOrders(myId, req);
  }

  @Get('taken')
  getTakenOrders(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getTakenOrders(myId, req);
  }

  @Get('placed')
  getPlacedOrders(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getPlacedOrders(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllOrders(@Query() req: Request): Promise<Response<Order>> {
    return this.ordersService.getAllOrders(req);
  }

  @Post()
  createOrder(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateOrderDto,
  ): Promise<void> {
    return this.ordersService.createOrder({ ...dto, myId, hasRole });
  }

  @Patch(':orderId')
  editOrder(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: EditOrderDto,
  ): Promise<void> {
    return this.ordersService.editOrder({ ...dto, orderId, myId, hasRole });
  }

  @Post(':orderId/take')
  takeOrder(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: TakeOrderDto,
  ): Promise<void> {
    return this.ordersService.takeOrder({ ...dto, orderId, myId, hasRole });
  }

  @Delete(':orderId/take')
  untakeOrder(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.untakeOrder({ orderId, myId, hasRole });
  }

  @Post(':orderId/execute')
  executeOrder(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.executeOrder({ orderId, myId, hasRole });
  }

  @Post(':orderId')
  completeOrder(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: CompleteOrderDto,
  ): Promise<void> {
    return this.ordersService.completeOrder({ ...dto, orderId, myId, hasRole });
  }

  @Delete(':orderId')
  deleteOrder(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.deleteOrder({ orderId, myId, hasRole });
  }
}
