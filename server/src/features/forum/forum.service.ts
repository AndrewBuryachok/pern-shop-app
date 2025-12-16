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

  async register(project: string, dto: AuthDto): Promise<User> {
    const password = await hashData(dto.password);
    await this.usersService.createUser(project, { ...dto, password });
    return this.usersService.selectSingleUser(project, dto.nick);
  }

  async selectSingleUser(project: string, nick: string): Promise<User> {
    const user = await this.usersService.selectSingleUser(project, nick);
    if (!user) {
      throw new AppException(UserError.UNKNOWN);
    }
    return user;
  }

  selectAllUsers(project: string): Promise<User[]> {
    return this.usersService.selectAllUsers(project);
  }

  getMyCards(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Card>> {
    return this.cardsService.getMyCards(project, myId, req);
  }

  selectMyCards(project: string, myId: number): Promise<Card[]> {
    return this.cardsService.selectUserCardsWithBalance(project, myId);
  }

  selectUserCards(project: string, userId: number): Promise<Card[]> {
    return this.cardsService.selectUserCards(project, userId);
  }

  createCard(project: string, myId: number, dto: CreateCardDto): Promise<void> {
    return this.cardsService.createCard(project, { ...dto, userId: myId });
  }

  editCard(
    project: string,
    myId: number,
    cardId: number,
    dto: EditCardDto,
  ): Promise<void> {
    return this.cardsService.editCard(project, {
      ...dto,
      cardId,
      myId,
      hasRole: false,
    });
  }

  addCardUser(
    project: string,
    myId: number,
    cardId: number,
    dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.addCardUser(project, {
      ...dto,
      cardId,
      myId,
      hasRole: false,
    });
  }

  removeCardUser(
    project: string,
    myId: number,
    cardId: number,
    dto: UpdateCardUserDto,
  ): Promise<void> {
    return this.cardsService.removeCardUser(project, {
      ...dto,
      cardId,
      myId,
      hasRole: false,
    });
  }

  getMyTransactions(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Transaction>> {
    return this.transactionsService.getMyTransactions(project, myId, req);
  }

  createDeposit(
    project: string,
    myId: number,
    dto: CreateTransactionDto,
  ): Promise<void> {
    return this.transactionsService.createDeposit(project, myId, dto);
  }

  createWithdraw(
    project: string,
    myId: number,
    dto: CreateTransactionDto,
  ): Promise<void> {
    return this.transactionsService.createWithdraw(project, myId, dto);
  }

  createTransfer(
    project: string,
    myId: number,
    dto: CreateTransferDto,
  ): Promise<void> {
    return this.transactionsService.createTransfer(project, {
      ...dto,
      myId,
      hasRole: false,
    });
  }

  getMyInvoices(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Invoice>> {
    return this.invoicesService.getMyInvoices(project, myId, req);
  }

  createInvoice(
    project: string,
    myId: number,
    dto: CreateInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.createInvoice(project, {
      ...dto,
      myId,
      hasRole: false,
    });
  }

  editInvoice(
    project: string,
    myId: number,
    invoiceId: number,
    dto: EditInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.editInvoice(project, {
      ...dto,
      invoiceId,
      myId,
      hasRole: false,
    });
  }

  completeInvoice(
    project: string,
    myId: number,
    invoiceId: number,
    dto: CompleteInvoiceDto,
  ): Promise<void> {
    return this.invoicesService.completeInvoice(project, {
      ...dto,
      invoiceId,
      myId,
      hasRole: false,
    });
  }

  deleteInvoice(
    project: string,
    myId: number,
    invoiceId: number,
  ): Promise<void> {
    return this.invoicesService.deleteInvoice(project, {
      invoiceId,
      myId,
      hasRole: false,
    });
  }

  getMainShops(project: string, req: Request): Promise<Response<Shop>> {
    return this.shopsService.getMainShops(project, req);
  }

  selectAllStations(project: string): Promise<Station[]> {
    return this.stationsService.selectAllStations(project);
  }

  getMainGoods(project: string, req: Request): Promise<Response<Good>> {
    return this.goodsService.getMainGoods(project, req);
  }

  getMyGoods(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Good>> {
    return this.goodsService.getMyGoods(project, myId, req);
  }

  getMyPurchases(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Purchase>> {
    return this.purchasesService.getMyPurchases(project, myId, req);
  }

  createPurchase(
    project: string,
    myId: number,
    dto: CreatePurchaseDto,
  ): Promise<void> {
    return this.purchasesService.createPurchase(project, {
      ...dto,
      myId,
      hasRole: false,
    });
  }

  getMainDeliveries(
    project: string,
    req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getMainDeliveries(project, req);
  }

  getMyDeliveries(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getMyDeliveries(project, myId, req);
  }

  getTakenDeliveries(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    return this.deliveriesService.getTakenDeliveries(project, myId, req);
  }

  takeDelivery(
    project: string,
    myId: number,
    deliveryId: number,
    dto: TakeDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.takeDelivery(project, {
      ...dto,
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  untakeDelivery(
    project: string,
    myId: number,
    deliveryId: number,
  ): Promise<void> {
    return this.deliveriesService.untakeDelivery(project, {
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  executeDelivery(
    project: string,
    myId: number,
    deliveryId: number,
  ): Promise<void> {
    return this.deliveriesService.executeDelivery(project, {
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  completeDelivery(
    project: string,
    myId: number,
    deliveryId: number,
    dto: CompleteDeliveryDto,
  ): Promise<void> {
    return this.deliveriesService.completeDelivery(project, {
      ...dto,
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  deleteDelivery(
    project: string,
    myId: number,
    deliveryId: number,
  ): Promise<void> {
    return this.deliveriesService.deleteDelivery(project, {
      deliveryId,
      myId,
      hasRole: false,
    });
  }

  getMainOrders(project: string, req: Request): Promise<Response<Order>> {
    return this.ordersService.getMainOrders(project, req);
  }

  getMyOrders(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getMyOrders(project, myId, req);
  }

  getTakenOrders(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Order>> {
    return this.ordersService.getTakenOrders(project, myId, req);
  }

  createOrder(
    project: string,
    myId: number,
    dto: CreateOrderDto,
  ): Promise<void> {
    return this.ordersService.createOrder(project, {
      ...dto,
      myId,
      hasRole: false,
    });
  }

  takeOrder(
    project: string,
    myId: number,
    orderId: number,
    dto: TakeOrderDto,
  ): Promise<void> {
    return this.ordersService.takeOrder(project, {
      ...dto,
      orderId,
      myId,
      hasRole: false,
    });
  }

  untakeOrder(project: string, myId: number, orderId: number): Promise<void> {
    return this.ordersService.untakeOrder(project, {
      orderId,
      myId,
      hasRole: false,
    });
  }

  executeOrder(project: string, myId: number, orderId: number): Promise<void> {
    return this.ordersService.executeOrder(project, {
      orderId,
      myId,
      hasRole: false,
    });
  }

  completeOrder(
    project: string,
    myId: number,
    orderId: number,
    dto: CompleteOrderDto,
  ): Promise<void> {
    return this.ordersService.completeOrder(project, {
      ...dto,
      orderId,
      myId,
      hasRole: false,
    });
  }

  deleteOrder(project: string, myId: number, orderId: number): Promise<void> {
    return this.ordersService.deleteOrder(project, {
      orderId,
      myId,
      hasRole: false,
    });
  }
}
