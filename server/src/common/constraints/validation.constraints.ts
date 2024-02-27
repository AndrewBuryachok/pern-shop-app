import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../../features/users/users.service';
import { ReportsService } from '../../features/reports/reports.service';
import { AnnotationsService } from '../../features/annotations/annotations.service';
import { ArticlesService } from '../../features/articles/articles.service';
import { CommentsService } from '../../features/comments/comments.service';
import { CardsService } from '../../features/cards/cards.service';
import { InvoicesService } from '../../features/invoices/invoices.service';
import { CitiesService } from '../../features/cities/cities.service';
import { ShopsService } from '../../features/shops/shops.service';
import { MarketsService } from '../../features/markets/markets.service';
import { StoragesService } from '../../features/storages/storages.service';
import { StoresService } from '../../features/stores/stores.service';
import { RentsService } from '../../features/rents/rents.service';
import { LeasesService } from '../../features/leases/leases.service';
import { GoodsService } from '../../features/goods/goods.service';
import { WaresService } from '../../features/wares/wares.service';
import { ProductsService } from '../../features/products/products.service';
import { LotsService } from '../../features/lots/lots.service';
import { TradesService } from '../../features/trades/trades.service';
import { SalesService } from '../../features/sales/sales.service';
import { OrdersService } from '../../features/orders/orders.service';
import { DeliveriesService } from '../../features/deliveries/deliveries.service';
import { TasksService } from '../../features/tasks/tasks.service';
import { PlaintsService } from '../../features/plaints/plaints.service';
import { AnswersService } from '../../features/answers/answers.service';
import { PollsService } from '../../features/polls/polls.service';
import { DiscussionsService } from '../../features/discussions/discussions.service';
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
    return 'Неизвестный пользователь';
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
    return 'Неизвестная новость';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isAnnotationExists', async: true })
export class IsAnnotationExists implements ValidatorConstraintInterface {
  constructor(private annotationsService: AnnotationsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.annotationsService.checkAnnotationExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Неизвестный комментарий';
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
    return 'Неизвестная публикация';
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
    return 'Неизвестный комментарий';
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
    return 'Неизвестная карта';
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
    return 'Неизвестный счет';
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
    return 'Неизвестный город';
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
    return 'Неизвестный магазин';
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
    return 'Неизвестный рынок';
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
    return 'Неизвестный склад';
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
    return 'Неизвестная палатка';
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
    return 'Неизвестная аренда';
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
    return 'Неизвестный прокат';
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
    return 'Неизвестный товар';
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
    return 'Неизвестное изделие';
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
    return 'Неизвестный продукт';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isLotExists', async: true })
export class IsLotExists implements ValidatorConstraintInterface {
  constructor(private lotsService: LotsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.lotsService.checkLotExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Неизвестный лот';
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
    return 'Неизвестный торг';
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
    return 'Неизвестный сбыт';
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
    return 'Неизвестный заказ';
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
    return 'Неизвестная доставка';
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
    return 'Неизвестное объявление';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isPlaintExists', async: true })
export class IsPlaintExists implements ValidatorConstraintInterface {
  constructor(private plaintsService: PlaintsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.plaintsService.checkPlaintExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Неизвестная жалоба';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isAnswerExists', async: true })
export class IsAnswerExists implements ValidatorConstraintInterface {
  constructor(private answersService: AnswersService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.answersService.checkAnswerExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Неизвестный ответ';
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
    return 'Неизвестная идея';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'isDiscussionExists', async: true })
export class IsDiscussionExists implements ValidatorConstraintInterface {
  constructor(private discussionsService: DiscussionsService) {}

  async validate(value: number): Promise<boolean> {
    try {
      await this.discussionsService.checkDiscussionExists(value);
    } catch (error) {
      return false;
    }
    return true;
  }

  defaultMessage(): string {
    return 'Неизвестное обсуждение';
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
    return 'Неизвестный рейтинг';
  }
}
