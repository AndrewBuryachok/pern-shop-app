import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoragesService } from './storages.service';
import { Storage } from './storage.entity';
import { CreateStorageDto, EditStorageDto, StorageIdDto } from './storage.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('storages')
@Controller('storages')
export class StoragesController {
  constructor(private storagesService: StoragesService) {}

  @Public()
  @Get()
  getMainStorages(@Query() req: Request): Promise<Response<Storage>> {
    return this.storagesService.getMainStorages(req);
  }

  @Get('my')
  getMyStorages(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Storage>> {
    return this.storagesService.getMyStorages(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllStorages(@Query() req: Request): Promise<Response<Storage>> {
    return this.storagesService.getAllStorages(req);
  }

  @Public()
  @Get('main/select')
  selectMainStorages(): Promise<Storage[]> {
    return this.storagesService.selectMainStorages();
  }

  @Get('my/select')
  selectMyStorages(@MyId() myId: number): Promise<Storage[]> {
    return this.storagesService.selectMyStorages(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all/select')
  selectAllStorages(): Promise<Storage[]> {
    return this.storagesService.selectAllStorages();
  }

  @Public()
  @Get('free/select')
  selectFreeStorages(): Promise<Storage[]> {
    return this.storagesService.selectFreeStorages();
  }

  @Post()
  createStorage(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateStorageDto,
  ): Promise<void> {
    return this.storagesService.createStorage({ ...dto, myId, hasRole });
  }

  @Patch(':storageId')
  editStorage(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { storageId }: StorageIdDto,
    @Body() dto: EditStorageDto,
  ): Promise<void> {
    return this.storagesService.editStorage({
      ...dto,
      storageId,
      myId,
      hasRole,
    });
  }
}
