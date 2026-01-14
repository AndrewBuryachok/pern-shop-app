import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../../features/users/users.service';
import { MessagesService } from '../../features/messages/messages.service';
import { ArticlesService } from '../../features/articles/articles.service';
import { CommentsService } from '../../features/articles/comments.service';
import { CardsService } from '../../features/cards/cards.service';
import { TransactionsService } from '../../features/transactions/transactions.service';
import { InvoicesService } from '../../features/invoices/invoices.service';
import { TownsService } from '../../features/towns/towns.service';
import { ShopsService } from '../../features/shops/shops.service';
import { StationsService } from '../../features/stations/stations.service';
import { GoodsService } from '../../features/goods/goods.service';
import { PurchasesService } from '../../features/purchases/purchases.service';
import { DeliveriesService } from '../../features/deliveries/deliveries.service';
import { OrdersService } from '../../features/orders/orders.service';

@Injectable()
@ValidatorConstraint({ name: 'isUserExists', async: true })
export class IsUserExists implements ValidatorConstraintInterface {
  constructor(private usersService: UsersService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.usersService.checkUserExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий користувач';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isMessageExists', async: true })
export class IsMessageExists implements ValidatorConstraintInterface {
  constructor(private messagesService: MessagesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.messagesService.checkMessageExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідоме повідомлення';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isArticleExists', async: true })
export class IsArticleExists implements ValidatorConstraintInterface {
  constructor(private articlesService: ArticlesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.articlesService.checkArticleExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома публікація';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isCommentExists', async: true })
export class IsCommentExists implements ValidatorConstraintInterface {
  constructor(private commentsService: CommentsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.commentsService.checkCommentExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий коментар';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isCardExists', async: true })
export class IsCardExists implements ValidatorConstraintInterface {
  constructor(private cardsService: CardsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.cardsService.checkCardExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома карта';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isTransactionExists', async: true })
export class IsTransactionExists implements ValidatorConstraintInterface {
  constructor(private transactionsService: TransactionsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.transactionsService.checkTransactionExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома транзакція';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isInvoiceExists', async: true })
export class IsInvoiceExists implements ValidatorConstraintInterface {
  constructor(private invoicesService: InvoicesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.invoicesService.checkInvoiceExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий інвойс';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isTownExists', async: true })
export class IsTownExists implements ValidatorConstraintInterface {
  constructor(private townsService: TownsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.townsService.checkTownExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідоме місто';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isShopExists', async: true })
export class IsShopExists implements ValidatorConstraintInterface {
  constructor(private shopsService: ShopsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.shopsService.checkShopExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий магазин';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isStationExists', async: true })
export class IsStationExists implements ValidatorConstraintInterface {
  constructor(private stationsService: StationsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.stationsService.checkStationExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий поштомат';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isGoodExists', async: true })
export class IsGoodExists implements ValidatorConstraintInterface {
  constructor(private goodsService: GoodsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.goodsService.checkGoodExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий товар';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isPurchaseExists', async: true })
export class IsPurchaseExists implements ValidatorConstraintInterface {
  constructor(private purchasesService: PurchasesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.purchasesService.checkPurchaseExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома покупка';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isDeliveryExists', async: true })
export class IsDeliveryExists implements ValidatorConstraintInterface {
  constructor(private deliveriesService: DeliveriesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.deliveriesService.checkDeliveryExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома доставка';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isOrderExists', async: true })
export class IsOrderExists implements ValidatorConstraintInterface {
  constructor(private ordersService: OrdersService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.ordersService.checkOrderExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідоме замовлення';
  }
}
