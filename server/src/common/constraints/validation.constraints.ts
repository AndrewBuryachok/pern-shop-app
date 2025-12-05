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
import { ExchangesService } from '../../features/exchanges/exchanges.service';
import { PaymentsService } from '../../features/payments/payments.service';
import { InvoicesService } from '../../features/invoices/invoices.service';
import { TownsService } from '../../features/towns/towns.service';
import { ShopsService } from '../../features/shops/shops.service';
import { MarketsService } from '../../features/markets/markets.service';
import { StoragesService } from '../../features/storages/storages.service';
import { StationsService } from '../../features/stations/stations.service';
import { MarketsTagsService } from '../../features/markets-tags/markets-tags.service';
import { StoragesTagsService } from '../../features/storages-tags/storages-tags.service';
import { StallsService } from '../../features/stalls/stalls.service';
import { CellsService } from '../../features/cells/cells.service';
import { BoxesService } from '../../features/boxes/boxes.service';
import { RentsService } from '../../features/rents/rents.service';
import { LeasesService } from '../../features/leases/leases.service';
import { HiresService } from '../../features/hires/hires.service';
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
@ValidatorConstraint({ name: 'isExchangeExists', async: true })
export class IsExchangeExists implements ValidatorConstraintInterface {
  constructor(private exchangesService: ExchangesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.exchangesService.checkExchangeExists(value);
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
@ValidatorConstraint({ name: 'isPaymentExists', async: true })
export class IsPaymentExists implements ValidatorConstraintInterface {
  constructor(private paymentsService: PaymentsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.paymentsService.checkPaymentExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий переказ';
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
    return 'Невідомий штраф';
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
@ValidatorConstraint({ name: 'isMarketExists', async: true })
export class IsMarketExists implements ValidatorConstraintInterface {
  constructor(private marketsService: MarketsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.marketsService.checkMarketExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий ринок';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isStorageExists', async: true })
export class IsStorageExists implements ValidatorConstraintInterface {
  constructor(private storagesService: StoragesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.storagesService.checkStorageExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий склад';
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
@ValidatorConstraint({ name: 'isMarketTagExists', async: true })
export class IsMarketTagExists implements ValidatorConstraintInterface {
  constructor(private marketsTagsService: MarketsTagsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.marketsTagsService.checkMarketTagExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий цінник';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isStorageTagExists', async: true })
export class IsStorageTagExists implements ValidatorConstraintInterface {
  constructor(private storagesTagsService: StoragesTagsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.storagesTagsService.checkStorageTagExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий цінник';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isStallExists', async: true })
export class IsStallExists implements ValidatorConstraintInterface {
  constructor(private stallsService: StallsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.stallsService.checkStallExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома палатка';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isCellExists', async: true })
export class IsCellExists implements ValidatorConstraintInterface {
  constructor(private cellsService: CellsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.cellsService.checkCellExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома комірка';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isBoxExists', async: true })
export class IsBoxExists implements ValidatorConstraintInterface {
  constructor(private boxesService: BoxesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.boxesService.checkBoxExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідомий ящик';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isRentExists', async: true })
export class IsRentExists implements ValidatorConstraintInterface {
  constructor(private rentsService: RentsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.rentsService.checkRentExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома оренда';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isLeaseExists', async: true })
export class IsLeaseExists implements ValidatorConstraintInterface {
  constructor(private leasesService: LeasesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.leasesService.checkLeaseExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома оренда';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isHireExists', async: true })
export class IsHireExists implements ValidatorConstraintInterface {
  constructor(private hiresService: HiresService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.hiresService.checkHireExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Невідома оренда';
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
