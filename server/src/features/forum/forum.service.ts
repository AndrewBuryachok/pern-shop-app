import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CardsService } from '../cards/cards.service';
import { TransactionsService } from '../transactions/transactions.service';
import { InvoicesService } from '../invoices/invoices.service';
import { ShopsService } from '../shops/shops.service';
import { StationsService } from '../stations/stations.service';
import { GoodsService } from '../goods/goods.service';
import { PurchasesService } from '../purchases/purchases.service';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { OrdersService } from '../orders/orders.service';
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
import {
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
} from '../invoices/invoice.dto';
import { CreatePurchaseDto } from '../purchases/purchase.dto';
import {
  CompleteDeliveryDto,
  TakeDeliveryDto,
} from '../deliveries/delivery.dto';
import {
  CompleteOrderDto,
  CreateOrderDto,
  TakeOrderDto,
} from '../orders/order.dto';
import { Request, Response } from '../../common/interfaces';
import { hashData } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { UserError } from '../users/user-error.enum';

@Injectable()
export class ForumService {
  constructor(
    private usersService: UsersService,
    private cardsService: CardsService,
    private transactionsService: TransactionsService,
    private invoicesService: InvoicesService,
    private shopsService: ShopsService,
    private stationsService: StationsService,
    private goodsService: GoodsService,
    private purchasesService: PurchasesService,
    private deliveriesService: DeliveriesService,
    private ordersService: OrdersService,
  ) {}

  async register(dto: AuthDto): Promise<User> {
    const password = await hashData(dto.password);
    await this.usersService.createUser({ ...dto, password });
    return this.usersService.selectSingleUser(dto.nick);
  }

  async selectSingleUser(nick: string): Promise<User> {
    const user = await this.usersService.selectSingleUser(nick);
    if (!user) {
      throw new AppException(UserError.UNKNOWN);
    }
    return user;
  }

  selectAllUsers(): Promise<User[]> {
    return this.usersService.selectAllUsers();
  }

  getMyCards(myId: number, req: Request): Promise<Response<Card>> {
    return this.cardsService.getMyCards(myId, req);
  }

  selectMyCards(myId: number): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(myId);
  }

  selectUserCards(userId: number): Promise<Card[]> {
    return this.cardsService.selectUserCards(userId);
  }

  createCard(myId: number, dto: CreateCardDto): Promise<void> {
    return this.cardsService.createCard({ ...dto, userId: myId });
  }

  editCard(myId: number, cardId: number, dto: EditCardDto): Promise<void> {
    return this.cardsService.editCard({ ...dto, cardId, myId, hasRole: false });
  }

  addCardUser(
    myId: number,
    cardId: number,
    dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.addCardUser({
      ...dto,
      cardId,
      myId,
      hasRole: false,
    });
  }

  removeCardUser(
    myId: number,
    cardId: number,
    dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.removeCardUser({
      ...dto,
      cardId,
      myId,
      hasRole: false,
    });
  }

  getMyTransactions(
    myId: number,
    req: Request,
  ): Promise<Response<Transaction>> {
    return this.transactionsService.getMyTransactions(myId, req);
  }

  createDeposit(myId: number, dto: CreateTransactionDto): Promise<void> {
    return this.transactionsService.createDeposit(myId, dto);
  }

  createWithdraw(myId: number, dto: CreateTransactionDto): Promise<void> {
    return this.transactionsService.createWithdraw(myId, dto);
  }

  createTransfer(myId: number, dto: CreateTransferDto): Promise<void> {
    return this.transactionsService.createTransfer({
      ...dto,
      myId,
      hasRole: false,
    });
  }

  getMyInvoices(myId: number, req: Request): Promise<Response<Invoice>> {
    return this.invoicesService.getMyInvoices(myId, req);
  }

  createInvoice(myId: number, dto: CreateInvoiceDto): Promise<void> {
    return this.invoicesService.createInvoice({ ...dto, myId, hasRole: false });
  }

  editInvoice(
    myId: number,
    invoiceId: number,
    dto: EditInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.editInvoice({
      ...dto,
      invoiceId,
      myId,
      hasRole: false,
    });
  }

  completeInvoice(
    myId: number,
    invoiceId: number,
    dto: CompleteInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.completeInvoice({
      ...dto,
      invoiceId,
      myId,
      hasRole: false,
    });
  }

  deleteInvoice(myId: number, invoiceId: number): Promise<void> {
    return this.invoicesService.deleteInvoice({
      invoiceId,
      myId,
      hasRole: false,
    });
  }

  getMainShops(req: Request): Promise<Response<Shop>> {
    return this.shopsService.getMainShops(req);
  }

  selectAllStations(): Promise<Station[]> {
    return this.stationsService.selectAllStations();
  }

  getMainGoods(req: Request): Promise<Response<Good>> {
    return this.goodsService.getMainGoods(req);
  }

  getMyGoods(myId: number, req: Request): Promise<Response<Good>> {
    return this.goodsService.getMyGoods(myId, req);
  }

  getMyPurchases(myId: number, req: Request): Promise<Response<Purchase>> {
    return this.purchasesService.getMyPurchases(myId, req);
  }

  createPurchase(myId: number, dto: CreatePurchaseDto): Promise<void> {
    return this.purchasesService.createPurchase({
      ...dto,
      myId,
      hasRole: false,
    });
  }

  getMainDeliveries(req: Request): Promise<Response<Delivery>> {
    return this.deliveriesService.getMainDeliveries(req);
  }

  getMyDeliveries(myId: number, req: Request): Promise<Response<Delivery>> {
    return this.deliveriesService.getMyDeliveries(myId, req);
  }

  getTakenDeliveries(myId: number, req: Request): Promise<Response<Delivery>> {
    return this.deliveriesService.getTakenDeliveries(myId, req);
  }

  takeDelivery(
    myId: number,
    deliveryId: number,
    dto: TakeDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.takeDelivery({
      ...dto,
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  untakeDelivery(myId: number, deliveryId: number): Promise<void> {
    return this.deliveriesService.untakeDelivery({
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  executeDelivery(myId: number, deliveryId: number): Promise<void> {
    return this.deliveriesService.executeDelivery({
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  completeDelivery(
    myId: number,
    deliveryId: number,
    dto: CompleteDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.completeDelivery({
      ...dto,
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  deleteDelivery(myId: number, deliveryId: number): Promise<void> {
    return this.deliveriesService.deleteDelivery({
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  getMainOrders(req: Request): Promise<Response<Order>> {
    return this.ordersService.getMainOrders(req);
  }

  getMyOrders(myId: number, req: Request): Promise<Response<Order>> {
    return this.ordersService.getMyOrders(myId, req);
  }

  getTakenOrders(myId: number, req: Request): Promise<Response<Order>> {
    return this.ordersService.getTakenOrders(myId, req);
  }

  createOrder(myId: number, dto: CreateOrderDto): Promise<void> {
    return this.ordersService.createOrder({ ...dto, myId, hasRole: false });
  }

  takeOrder(myId: number, orderId: number, dto: TakeOrderDto): Promise<void> {
    return this.ordersService.takeOrder({
      ...dto,
      orderId,
      myId,
      hasRole: false,
    });
  }

  untakeOrder(myId: number, orderId: number): Promise<void> {
    return this.ordersService.untakeOrder({ orderId, myId, hasRole: false });
  }

  executeOrder(myId: number, orderId: number): Promise<void> {
    return this.ordersService.executeOrder({ orderId, myId, hasRole: false });
  }

  completeOrder(
    myId: number,
    orderId: number,
    dto: CompleteOrderDto,
  ): Promise<void> {
    return this.ordersService.completeOrder({
      ...dto,
      orderId,
      myId,
      hasRole: false,
    });
  }

  deleteOrder(myId: number, orderId: number): Promise<void> {
    return this.ordersService.deleteOrder({ orderId, myId, hasRole: false });
  }
}
