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
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { CreateOrderDto, OrderIdDto, TakeOrderDto } from './order.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
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

  @Roles(Role.MANAGER)
  @Get('all')
  getAllOrders(@Query() req: Request): Promise<Response<Order>> {
    return this.ordersService.getAllOrders(req);
  }

  @Post()
  createOrder(
    @MyId() myId: number,
    @Body() dto: CreateOrderDto,
  ): Promise<void> {
    return this.ordersService.createOrder({ ...dto, myId });
  }

  @Post(':orderId/take')
  takeOrder(
    @MyId() myId: number,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: TakeOrderDto,
  ): Promise<void> {
    return this.ordersService.takeOrder({ ...dto, orderId, myId });
  }

  @Delete(':orderId/take')
  untakeOrder(
    @MyId() myId: number,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.untakeOrder({ orderId, myId });
  }

  @Post(':orderId/execute')
  executeOrder(
    @MyId() myId: number,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.executeOrder({ orderId, myId });
  }

  @Post(':orderId')
  completeOrder(
    @MyId() myId: number,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.completeOrder({ orderId, myId });
  }

  @Delete(':orderId')
  deleteOrder(
    @MyId() myId: number,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.ordersService.deleteOrder({ orderId, myId });
  }
}
