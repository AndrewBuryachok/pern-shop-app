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
import { MarketsDeliveriesService } from './markets-deliveries.service';
import { MarketDelivery } from './market-delivery.entity';
import {
  CreateMarketDeliveryDto,
  EditMarketDeliveryDto,
  MarketDeliveryIdDto,
  RateMarketDeliveryDto,
  TakeMarketDeliveryDto,
} from './market-delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('markets-deliveries')
@Controller('markets-deliveries')
export class MarketsDeliveriesController {
  constructor(private marketsDeliveriesService: MarketsDeliveriesService) {}

  @Public()
  @Get()
  getMainMarketsDeliveries(
    @Query() req: Request,
  ): Promise<Response<MarketDelivery>> {
    return this.marketsDeliveriesService.getMainMarketsDeliveries(req);
  }

  @Get('my')
  getMyMarketsDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<MarketDelivery>> {
    return this.marketsDeliveriesService.getMyMarketsDeliveries(myId, req);
  }

  @Get('taken')
  getTakenMarketsDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<MarketDelivery>> {
    return this.marketsDeliveriesService.getTakenMarketsDeliveries(myId, req);
  }

  @Get('placed')
  getPlacedMarketsDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<MarketDelivery>> {
    return this.marketsDeliveriesService.getPlacedMarketsDeliveries(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllMarketsDeliveries(
    @Query() req: Request,
  ): Promise<Response<MarketDelivery>> {
    return this.marketsDeliveriesService.getAllMarketsDeliveries(req);
  }

  @Post()
  createMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateMarketDeliveryDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.createMarketDelivery({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':marketDeliveryId')
  editMarketDelivery(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { marketDeliveryId }: MarketDeliveryIdDto,
    @Body() dto: EditMarketDeliveryDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.editMarketDelivery({
      ...dto,
      marketDeliveryId,
      myId,
      hasRole,
    });
  }

  @Post(':marketDeliveryId/take')
  takeMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { marketDeliveryId }: MarketDeliveryIdDto,
    @Body() dto: TakeMarketDeliveryDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.takeMarketDelivery({
      ...dto,
      marketDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':marketDeliveryId/take')
  untakeMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { marketDeliveryId }: MarketDeliveryIdDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.untakeMarketDelivery({
      marketDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':marketDeliveryId/execute')
  executeMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { marketDeliveryId }: MarketDeliveryIdDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.executeMarketDelivery({
      marketDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':marketDeliveryId')
  completeMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { marketDeliveryId }: MarketDeliveryIdDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.completeMarketDelivery({
      marketDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':marketDeliveryId')
  deleteMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { marketDeliveryId }: MarketDeliveryIdDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.deleteMarketDelivery({
      marketDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':marketDeliveryId/rate')
  rateMarketDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { marketDeliveryId }: MarketDeliveryIdDto,
    @Body() dto: RateMarketDeliveryDto,
  ): Promise<void> {
    return this.marketsDeliveriesService.rateMarketDelivery({
      ...dto,
      marketDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }
}
