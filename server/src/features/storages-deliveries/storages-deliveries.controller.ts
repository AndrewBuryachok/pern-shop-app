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
import { StoragesDeliveriesService } from './storages-deliveries.service';
import { StorageDelivery } from './storage-delivery.entity';
import {
  CreateStorageDeliveryDto,
  EditStorageDeliveryDto,
  RateStorageDeliveryDto,
  StorageDeliveryIdDto,
  TakeStorageDeliveryDto,
} from './storage-delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('storages-deliveries')
@Controller('storages-deliveries')
export class StoragesDeliveriesController {
  constructor(private storagesDeliveriesService: StoragesDeliveriesService) {}

  @Public()
  @Get()
  getMainStoragesDeliveries(
    @Query() req: Request,
  ): Promise<Response<StorageDelivery>> {
    return this.storagesDeliveriesService.getMainStoragesDeliveries(req);
  }

  @Get('my')
  getMyStoragesDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<StorageDelivery>> {
    return this.storagesDeliveriesService.getMyStoragesDeliveries(myId, req);
  }

  @Get('taken')
  getTakenStoragesDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<StorageDelivery>> {
    return this.storagesDeliveriesService.getTakenStoragesDeliveries(myId, req);
  }

  @Get('placed')
  getPlacedStoragesDeliveries(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<StorageDelivery>> {
    return this.storagesDeliveriesService.getPlacedStoragesDeliveries(
      myId,
      req,
    );
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllStoragesDeliveries(
    @Query() req: Request,
  ): Promise<Response<StorageDelivery>> {
    return this.storagesDeliveriesService.getAllStoragesDeliveries(req);
  }

  @Post()
  createStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateStorageDeliveryDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.createStorageDelivery({
      ...dto,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':storageDeliveryId')
  editStorageDelivery(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { storageDeliveryId }: StorageDeliveryIdDto,
    @Body() dto: EditStorageDeliveryDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.editStorageDelivery({
      ...dto,
      storageDeliveryId,
      myId,
      hasRole,
    });
  }

  @Post(':storageDeliveryId/take')
  takeStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { storageDeliveryId }: StorageDeliveryIdDto,
    @Body() dto: TakeStorageDeliveryDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.takeStorageDelivery({
      ...dto,
      storageDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':storageDeliveryId/take')
  untakeStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { storageDeliveryId }: StorageDeliveryIdDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.untakeStorageDelivery({
      storageDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':storageDeliveryId/execute')
  executeStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { storageDeliveryId }: StorageDeliveryIdDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.executeStorageDelivery({
      storageDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':storageDeliveryId')
  completeStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { storageDeliveryId }: StorageDeliveryIdDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.completeStorageDelivery({
      storageDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':storageDeliveryId')
  deleteStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { storageDeliveryId }: StorageDeliveryIdDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.deleteStorageDelivery({
      storageDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }

  @Patch(':storageDeliveryId/rate')
  rateStorageDelivery(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Param() { storageDeliveryId }: StorageDeliveryIdDto,
    @Body() dto: RateStorageDeliveryDto,
  ): Promise<void> {
    return this.storagesDeliveriesService.rateStorageDelivery({
      ...dto,
      storageDeliveryId,
      myId,
      nick,
      hasRole,
    });
  }
}
