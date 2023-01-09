import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { Storage } from './storage.entity';
import { CreateStorageDto, EditStorageDto, StorageIdDto } from './storage.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('storages')
export class StoragesController {
  constructor(private storagesService: StoragesService) {}

  @Get()
  getMainStorages(): Promise<Storage[]> {
    return this.storagesService.getMainStorages();
  }

  @Get('my')
  getMyStorages(@MyId() myId: number): Promise<Storage[]> {
    return this.storagesService.getMyStorages(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllStorages(): Promise<Storage[]> {
    return this.storagesService.getAllStorages();
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
