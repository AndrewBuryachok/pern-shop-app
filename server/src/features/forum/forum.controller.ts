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
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { Public } from '../../common/decorators';
import { ForumApiKeyGuard } from '../../common/guards';

@Public()
@UseGuards(ForumApiKeyGuard)
@ApiTags(':project/forum')
@Controller(':project/forum')
export class ForumController {
  constructor(private forumService: ForumService) {}

  @Post('register')
  register(
    @Param() { project }: ProjectDto,
    @Body() dto: AuthDto,
  ): Promise<User> {
    return this.forumService.register(project, dto);
  }

  @Get(':nick/auth')
  selectSingleUser(
    @Param() { project }: ProjectDto,
    @Param() { nick }: UserNickDto,
  ): Promise<User> {
    return this.forumService.selectSingleUser(project, nick);
  }

  @Get(':userId/users/all/select')
  selectAllUsers(@Param() { project }: ProjectDto): Promise<User[]> {
    return this.forumService.selectAllUsers(project);
  }

  @Get(':userId/cards/my')
  getMyCards(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Card>> {
    return this.forumService.getMyCards(project, userId, req);
  }

  @Get(':userId/cards/my/select')
  selectMyCards(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
  ): Promise<Card[]> {
    return this.forumService.selectMyCards(project, userId);
  }

  @Get(':myId/cards/:userId/select')
  selectUserCards(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
  ): Promise<Card[]> {
    return this.forumService.selectUserCards(project, userId);
  }

  @Post(':userId/cards')
  createCard(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateCardDto,
  ): Promise<void> {
    return this.forumService.createCard(project, userId, dto);
  }

  @Patch(':userId/cards/:cardId')
  editCard(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { cardId }: CardIdDto,
    @Body() dto: EditCardDto,
  ): Promise<void> {
    return this.forumService.editCard(project, userId, cardId, dto);
  }

  @Post(':userId/cards/:cardId/users')
  addCardUser(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.forumService.addCardUser(project, userId, cardId, dto);
  }

  @Delete(':userId/cards/:cardId/users')
  removeCardUser(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { cardId }: CardIdDto,
    @Body() dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.forumService.removeCardUser(project, userId, cardId, dto);
  }

  @Get(':userId/transactions/my')
  getMyTransactions(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Transaction>> {
    return this.forumService.getMyTransactions(project, userId, req);
  }

  @Post(':userId/transactions/deposit')
  createDeposit(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.forumService.createDeposit(project, userId, dto);
  }

  @Post(':userId/transactions/withdraw')
  createWithdraw(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateTransactionDto,
  ): Promise<void> {
    return this.forumService.createWithdraw(project, userId, dto);
  }

  @Post(':userId/transactions/transfer')
  createTransfer(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateTransferDto,
  ): Promise<void> {
    return this.forumService.createTransfer(project, userId, dto);
  }

  @Get(':userId/invoices/my')
  getMyInvoices(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Invoice>> {
    return this.forumService.getMyInvoices(project, userId, req);
  }

  @Post(':userId/invoices')
  createInvoice(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateInvoiceDto,
  ): Promise<void> {
    return this.forumService.createInvoice(project, userId, dto);
  }

  @Patch(':userId/invoices/:invoiceId')
  editInvoice(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: EditInvoiceDto,
  ): Promise<void> {
    return this.forumService.editInvoice(project, userId, invoiceId, dto);
  }

  @Post(':userId/invoices/:invoiceId')
  completeInvoice(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { invoiceId }: InvoiceIdDto,
    @Body() dto: CompleteInvoiceDto,
  ): Promise<void> {
    return this.forumService.completeInvoice(project, userId, invoiceId, dto);
  }

  @Delete(':userId/invoices/:invoiceId')
  deleteInvoice(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { invoiceId }: InvoiceIdDto,
  ): Promise<void> {
    return this.forumService.deleteInvoice(project, userId, invoiceId);
  }

  @Get(':userId/shops')
  getMainShops(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Shop>> {
    return this.forumService.getMainShops(project, req);
  }

  @Get(':userId/stations/all/select')
  selectAllStations(@Param() { project }: ProjectDto): Promise<Station[]> {
    return this.forumService.selectAllStations(project);
  }

  @Get(':userId/goods')
  getMainGoods(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Good>> {
    return this.forumService.getMainGoods(project, req);
  }

  @Get(':userId/goods/my')
  getMyGoods(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Good>> {
    return this.forumService.getMyGoods(project, userId, req);
  }

  @Get(':userId/purchases/my')
  getMyPurchases(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Purchase>> {
    return this.forumService.getMyPurchases(project, userId, req);
  }

  @Post(':userId/purchases')
  createPurchase(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: CreatePurchaseDto,
  ): Promise<void> {
    return this.forumService.createPurchase(project, userId, dto);
  }

  @Get(':userId/deliveries')
  getMainDeliveries(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.forumService.getMainDeliveries(project, req);
  }

  @Get(':userId/deliveries/my')
  getMyDeliveries(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.forumService.getMyDeliveries(project, userId, req);
  }

  @Get(':userId/deliveries/taken')
  getTakenDeliveries(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Delivery>> {
    return this.forumService.getTakenDeliveries(project, userId, req);
  }

  @Post(':userId/deliveries/:deliveryId/take')
  takeDelivery(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: TakeDeliveryDto,
  ): Promise<void> {
    return this.forumService.takeDelivery(project, userId, deliveryId, dto);
  }

  @Delete(':userId/deliveries/:deliveryId/take')
  untakeDelivery(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.forumService.untakeDelivery(project, userId, deliveryId);
  }

  @Post(':userId/deliveries/:deliveryId/execute')
  executeDelivery(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.forumService.executeDelivery(project, userId, deliveryId);
  }

  @Post(':userId/deliveries/:deliveryId')
  completeDelivery(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
    @Body() dto: CompleteDeliveryDto,
  ): Promise<void> {
    return this.forumService.completeDelivery(project, userId, deliveryId, dto);
  }

  @Delete(':userId/deliveries/:deliveryId')
  deleteDelivery(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { deliveryId }: DeliveryIdDto,
  ): Promise<void> {
    return this.forumService.deleteDelivery(project, userId, deliveryId);
  }

  @Get(':userId/orders')
  getMainOrders(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.forumService.getMainOrders(project, req);
  }

  @Get(':userId/orders/my')
  getMyOrders(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.forumService.getMyOrders(project, userId, req);
  }

  @Get(':userId/orders/taken')
  getTakenOrders(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Query() req: Request,
  ): Promise<Response<Order>> {
    return this.forumService.getTakenOrders(project, userId, req);
  }

  @Post(':userId/orders')
  createOrder(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Body() dto: CreateOrderDto,
  ): Promise<void> {
    return this.forumService.createOrder(project, userId, dto);
  }

  @Post(':userId/orders/:orderId/take')
  takeOrder(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: TakeOrderDto,
  ): Promise<void> {
    return this.forumService.takeOrder(project, userId, orderId, dto);
  }

  @Delete(':userId/orders/:orderId/take')
  untakeOrder(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.forumService.untakeOrder(project, userId, orderId);
  }

  @Post(':userId/orders/:orderId/execute')
  executeOrder(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.forumService.executeOrder(project, userId, orderId);
  }

  @Post(':userId/orders/:orderId')
  completeOrder(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
    @Body() dto: CompleteOrderDto,
  ): Promise<void> {
    return this.forumService.completeOrder(project, userId, orderId, dto);
  }

  @Delete(':userId/orders/:orderId')
  deleteOrder(
    @Param() { project }: ProjectDto,
    @Param() { userId }: UserIdDto,
    @Param() { orderId }: OrderIdDto,
  ): Promise<void> {
    return this.forumService.deleteOrder(project, userId, orderId);
  }
}
