import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';
import { Transaction } from '../transactions/transaction.entity';
import { Invoice } from '../invoices/invoice.entity';
import { Shop } from '../shops/shop.entity';
import { Station } from '../stations/station.entity';
import { Good } from '../goods/good.entity';
import { Purchase } from '../purchases/purchase.entity';
import { Delivery } from '../deliveries/delivery.entity';
import { Order } from '../orders/order.entity';
import { AuthDto } from '../auth/auth.dto';
import { UserIdDto, UserNickDto } from '../users/user.dto';
import {
  CardIdDto,
  CreateCardDto,
  EditCardDto,
  UpdateCardUserDto,
} from '../cards/card.dto';
import {
  CreateTransactionDto,
  CreateTransferDto,
} from '../transactions/transaction.dto';
import {
  CompleteInvoiceDto,
  CreateInvoiceDto,
  EditInvoiceDto,
  InvoiceIdDto,
} from '../invoices/invoice.dto';
import { CreatePurchaseDto } from '../purchases/purchase.dto';
import {
  CompleteDeliveryDto,
  DeliveryIdDto,
  TakeDeliveryDto,
} from '../deliveries/delivery.dto';
import {
  CompleteOrderDto,
  CreateOrderDto,
  OrderIdDto,
  TakeOrderDto,
} from '../orders/order.dto';
import { Request, Response } from '../../common/interfaces';
import { Public } from '../../common/decorators';
import { ForumApiKeyGuard } from '../../common/guards';

@Public()
@UseGuards(ForumApiKeyGuard)
@ApiTags('forum')
@Controller(['forum', ':project/forum'])
export class ForumController {
  constructor(private forumService: ForumService) {}

  @Post('register')
  register(@Body() dto: AuthDto): Promise<User> {
    return this.forumService.register(dto);
  }

  @Get(':nick/auth')
  selectSingleUser(@Param() { nick }: UserNickDto): Promise<User> {
    return this.forumService.selectSingleUser(nick);
  }

  @Get(':userId/users/all/select')
  selectAllUsers(): Promise<User[]> {
    return this.forumService.selectAllUsers();
  }

  @Get(':userId/cards/my')
  getMyCards(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Card>> {
    return this.forumService.getMyCards(userId, req);
  }

  @Get(':userId/cards/my/select')
  selectMyCards(@Param() { userId }: UserIdDto): Promise<Card[]> {
    return this.forumService.selectMyCards(userId);
  }

  @Get(':myId/cards/:userId/select')
  selectUserCards(@Param() { userId }: UserIdDto): Promise<Card[]> {
    return this.forumService.selectUserCards(userId);
  }

  @Post(':userId/cards')
  createCard(
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateCardDto,
  ): Promise<void> {
    return this.forumService.createCard(userId, dto);
  }

  @Patch(':userId/cards/:cardId')
  editCard(
    @Param() { userId }: UserIdDto,
    @Param() { cardId }: CardIdDto,
    @Body() dto: EditCardDto,
  ): Promise<void> {
    return this.forumService.editCard(userId, cardId, dto);
  }

  @Post(':userId/cards/:cardId/users')
  addCardUser(
    @Param() { userId }: UserIdDto,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.forumService.addCardUser(userId, cardId, dto);
  }

  @Delete(':userId/cards/:cardId/users')
  removeCardUser(
    @Param() { userId }: UserIdDto,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.forumService.removeCardUser(userId, cardId, dto);
  }

  @Get(':userId/transactions/my')
  getMyTransactions(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Transaction>> {
    return this.forumService.getMyTransactions(userId, req);
  }

  @Post(':userId/transactions/deposit')
  createDeposit(
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.forumService.createDeposit(userId, dto);
  }

  @Post(':userId/transactions/withdraw')
  createWithdraw(
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.forumService.createWithdraw(userId, dto);
  }

  @Post(':userId/transactions/transfer')
  createTransfer(
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateTransferDto,
  ): Promise<void> {
    return this.forumService.createTransfer(userId, dto);
  }

  @Get(':userId/invoices/my')
  getMyInvoices(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Invoice>> {
    return this.forumService.getMyInvoices(userId, req);
  }

  @Post(':userId/invoices')
  createInvoice(
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateInvoiceDto,
  ): Promise<void> {
    return this.forumService.createInvoice(userId, dto);
  }

  @Patch(':userId/invoices/:invoiceId')
  editInvoice(
    @Param() { userId }: UserIdDto,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: EditInvoiceDto,
  ): Promise<void> {
    return this.forumService.editInvoice(userId, invoiceId, dto);
  }

  @Post(':userId/invoices/:invoiceId')
  completeInvoice(
    @Param() { userId }: UserIdDto,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: CompleteInvoiceDto,
  ): Promise<void> {
    return this.forumService.completeInvoice(userId, invoiceId, dto);
  }

  @Delete(':userId/invoices/:invoiceId')
  deleteInvoice(
    @Param() { userId }: UserIdDto,
    @Param() { invoiceId }: InvoiceIdDto,
  ): Promise<void> {
    return this.forumService.deleteInvoice(userId, invoiceId);
  }

  @Get(':userId/shops')
  getMainShops(@Query() req: Request): Promise<Response<Shop>> {
    return this.forumService.getMainShops(req);
  }

  @Get(':userId/stations/all/select')
  selectAllStations(): Promise<Station[]> {
    return this.forumService.selectAllStations();
  }

  @Get(':userId/goods')
  getMainGoods(@Query() req: Request): Promise<Response<Good>> {
    return this.forumService.getMainGoods(req);
  }

  @Get(':userId/goods/my')
  getMyGoods(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Good>> {
    return this.forumService.getMyGoods(userId, req);
  }

  @Get(':userId/purchases/my')
  getMyPurchases(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Purchase>> {
    return this.forumService.getMyPurchases(userId, req);
  }

  @Post(':userId/purchases')
  createPurchase(
    @Param() { userId }: UserIdDto,
    @Body() dto: CreatePurchaseDto,
  ): Promise<void> {
    return this.forumService.createPurchase(userId, dto);
  }

  @Get(':userId/deliveries')
  getMainDeliveries(@Query() req: Request): Promise<Response<Delivery>> {
    return this.forumService.getMainDeliveries(req);
  }

  @Get(':userId/deliveries/my')
  getMyDeliveries(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.forumService.getMyDeliveries(userId, req);
  }

  @Get(':userId/deliveries/taken')
  getTakenDeliveries(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.forumService.getTakenDeliveries(userId, req);
  }

  @Post(':userId/deliveries/:deliveryId/take')
  takeDelivery(
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: TakeDeliveryDto,
  ): Promise<void> {
    return this.forumService.takeDelivery(userId, deliveryId, dto);
  }

  @Delete(':userId/deliveries/:deliveryId/take')
  untakeDelivery(
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.forumService.untakeDelivery(userId, deliveryId);
  }

  @Post(':userId/deliveries/:deliveryId/execute')
  executeDelivery(
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.forumService.executeDelivery(userId, deliveryId);
  }

  @Post(':userId/deliveries/:deliveryId')
  completeDelivery(
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: CompleteDeliveryDto,
  ): Promise<void> {
    return this.forumService.completeDelivery(userId, deliveryId, dto);
  }

  @Delete(':userId/deliveries/:deliveryId')
  deleteDelivery(
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.forumService.deleteDelivery(userId, deliveryId);
  }

  @Get(':userId/orders')
  getMainOrders(@Query() req: Request): Promise<Response<Order>> {
    return this.forumService.getMainOrders(req);
  }

  @Get(':userId/orders/my')
  getMyOrders(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.forumService.getMyOrders(userId, req);
  }

  @Get(':userId/orders/taken')
  getTakenOrders(
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.forumService.getTakenOrders(userId, req);
  }

  @Post(':userId/orders')
  createOrder(
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateOrderDto,
  ): Promise<void> {
    return this.forumService.createOrder(userId, dto);
  }

  @Post(':userId/orders/:orderId/take')
  takeOrder(
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: TakeOrderDto,
  ): Promise<void> {
    return this.forumService.takeOrder(userId, orderId, dto);
  }

  @Delete(':userId/orders/:orderId/take')
  untakeOrder(
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.forumService.untakeOrder(userId, orderId);
  }

  @Post(':userId/orders/:orderId/execute')
  executeOrder(
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.forumService.executeOrder(userId, orderId);
  }

  @Post(':userId/orders/:orderId')
  completeOrder(
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: CompleteOrderDto,
  ): Promise<void> {
    return this.forumService.completeOrder(userId, orderId, dto);
  }

  @Delete(':userId/orders/:orderId')
  deleteOrder(
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.forumService.deleteOrder(userId, orderId);
  }
}
