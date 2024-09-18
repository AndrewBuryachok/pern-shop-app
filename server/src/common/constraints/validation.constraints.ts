import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../../features/users/users.service';
import { MessagesService } from '../../features/messages/messages.service';
import { ReportsService } from '../../features/reports/reports.service';
import { CommentsService as ReportsCommentsService } from '../../features/reports/comments.service';
import { ArticlesService } from '../../features/articles/articles.service';
import { CommentsService as ArticlesCommentsService } from '../../features/articles/comments.service';
import { PollsService } from '../../features/polls/polls.service';
import { CommentsService as PollsCommentsService } from '../../features/polls/comments.service';
import { CardsService } from '../../features/cards/cards.service';
import { ExchangesService } from '../../features/exchanges/exchanges.service';
import { PaymentsService } from '../../features/payments/payments.service';
import { InvoicesService } from '../../features/invoices/invoices.service';
import { CitiesService } from '../../features/cities/cities.service';
import { FarmsService } from '../../features/farms/farms.service';
import { ShopsService } from '../../features/shops/shops.service';
import { MarketsService } from '../../features/markets/markets.service';
import { StoragesService } from '../../features/storages/storages.service';
import { StationsService } from '../../features/stations/stations.service';
import { MarketsTagsService } from '../../features/markets-tags/markets-tags.service';
import { StoragesTagsService } from '../../features/storages-tags/storages-tags.service';
import { StoresService } from '../../features/stores/stores.service';
import { CellsService } from '../../features/cells/cells.service';
import { DrawersService } from '../../features/drawers/drawers.service';
import { RentsService } from '../../features/rents/rents.service';
import { LeasesService } from '../../features/leases/leases.service';
import { HiresService } from '../../features/hires/hires.service';
import { GoodsService } from '../../features/goods/goods.service';
import { WaresService } from '../../features/wares/wares.service';
import { ProductsService } from '../../features/products/products.service';
import { BargainsService } from '../../features/bargains/bargains.service';
import { TradesService } from '../../features/trades/trades.service';
import { SalesService } from '../../features/sales/sales.service';
import { OrdersService } from '../../features/orders/orders.service';
import { DeliveriesService } from '../../features/deliveries/deliveries.service';
import { ShopsDeliveriesService } from '../../features/shops-deliveries/shops-deliveries.service';
import { MarketsDeliveriesService } from '../../features/markets-deliveries/markets-deliveries.service';
import { StoragesDeliveriesService } from '../../features/storages-deliveries/storages-deliveries.service';
import { TasksService } from '../../features/tasks/tasks.service';
import { AdvertsService } from '../../features/adverts/adverts.service';
import { RatingsService } from '../../features/ratings/ratings.service';

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
    return 'Unknown user';
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
    return 'Unknown message';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isReportExists', async: true })
export class IsReportExists implements ValidatorConstraintInterface {
  constructor(private reportsService: ReportsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.reportsService.checkReportExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown report';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isReportCommentExists', async: true })
export class IsReportCommentExists implements ValidatorConstraintInterface {
  constructor(private commentsService: ReportsCommentsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.commentsService.checkCommentExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown comment';
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
    return 'Unknown article';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isArticleCommentExists', async: true })
export class IsArticleCommentExists implements ValidatorConstraintInterface {
  constructor(private commentsService: ArticlesCommentsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.commentsService.checkCommentExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown comment';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isPollExists', async: true })
export class IsPollExists implements ValidatorConstraintInterface {
  constructor(private pollsService: PollsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.pollsService.checkPollExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown poll';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isPollCommentExists', async: true })
export class IsPollCommentExists implements ValidatorConstraintInterface {
  constructor(private commentsService: PollsCommentsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.commentsService.checkCommentExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown comment';
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
    return 'Unknown card';
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
    return 'Unknown exchange';
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
    return 'Unknown payment';
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
    return 'Unknown invoice';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isCityExists', async: true })
export class IsCityExists implements ValidatorConstraintInterface {
  constructor(private citiesService: CitiesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.citiesService.checkCityExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown city';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isFarmExists', async: true })
export class IsFarmExists implements ValidatorConstraintInterface {
  constructor(private farmsService: FarmsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.farmsService.checkFarmExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown farm';
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
    return 'Unknown shop';
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
    return 'Unknown market';
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
    return 'Unknown storage';
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
    return 'Unknown station';
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
    return 'Unknown market tag';
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
    return 'Unknown storage tag';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isStoreExists', async: true })
export class IsStoreExists implements ValidatorConstraintInterface {
  constructor(private storesService: StoresService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.storesService.checkStoreExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown store';
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
    return 'Unknown cell';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isDrawerExists', async: true })
export class IsDrawerExists implements ValidatorConstraintInterface {
  constructor(private drawersService: DrawersService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.drawersService.checkDrawerExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown drawer';
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
    return 'Unknown rent';
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
    return 'Unknown lease';
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
    return 'Unknown hire';
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
    return 'Unknown good';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isWareExists', async: true })
export class IsWareExists implements ValidatorConstraintInterface {
  constructor(private waresService: WaresService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.waresService.checkWareExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown ware';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isProductExists', async: true })
export class IsProductExists implements ValidatorConstraintInterface {
  constructor(private productsService: ProductsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.productsService.checkProductExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown product';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isBargainExists', async: true })
export class IsBargainExists implements ValidatorConstraintInterface {
  constructor(private bargainsService: BargainsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.bargainsService.checkBargainExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown bargain';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isTradeExists', async: true })
export class IsTradeExists implements ValidatorConstraintInterface {
  constructor(private tradesService: TradesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.tradesService.checkTradeExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown trade';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isSaleExists', async: true })
export class IsSaleExists implements ValidatorConstraintInterface {
  constructor(private salesService: SalesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.salesService.checkSaleExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown sale';
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
    return 'Unknown order';
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
    return 'Unknown delivery';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isShopDeliveryExists', async: true })
export class IsShopDeliveryExists implements ValidatorConstraintInterface {
  constructor(private shopsDeliveriesService: ShopsDeliveriesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.shopsDeliveriesService.checkShopDeliveryExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown shop delivery';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isMarketDeliveryExists', async: true })
export class IsMarketDeliveryExists implements ValidatorConstraintInterface {
  constructor(private marketsDeliveriesService: MarketsDeliveriesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.marketsDeliveriesService.checkMarketDeliveryExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown market delivery';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isStorageDeliveryExists', async: true })
export class IsStorageDeliveryExists implements ValidatorConstraintInterface {
  constructor(private storagesDeliveriesService: StoragesDeliveriesService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.storagesDeliveriesService.checkStorageDeliveryExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown storage delivery';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isTaskExists', async: true })
export class IsTaskExists implements ValidatorConstraintInterface {
  constructor(private tasksService: TasksService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.tasksService.checkTaskExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown task';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isAdvertExists', async: true })
export class IsAdvertExists implements ValidatorConstraintInterface {
  constructor(private advertsService: AdvertsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.advertsService.checkAdvertExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown advert';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isRatingExists', async: true })
export class IsRatingExists implements ValidatorConstraintInterface {
  constructor(private ratingsService: RatingsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.ratingsService.checkRatingExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Unknown rating';
  }
}
