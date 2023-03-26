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
import { MyId, Public, Roles } from '../../common/decorators';
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
  @Get('all/select')
  selectAllStorages(): Promise<Storage[]> {
    return this.storagesService.selectAllStorages();
  }

  @Get('my/select')
  selectMyStorages(@MyId() myId: number): Promise<Storage[]> {
    return this.storagesService.selectMyStorages(myId);
  }

  @Get('free/select')
  selectFreeStorages(): Promise<Storage[]> {
    return this.storagesService.selectFreeStorages();
  }

  @Post()
  createStorage(
    @MyId() myId: number,
    @Body() dto: CreateStorageDto,
  ): Promise<void> {
    return this.storagesService.createStorage({ ...dto, myId });
  }

  @Patch(':storageId')
  editStorage(
    @MyId() myId: number,
    @Param() { storageId }: StorageIdDto,
    @Body() dto: EditStorageDto,
  ): Promise<void> {
    return this.storagesService.editStorage({ ...dto, storageId, myId });
  }
}
