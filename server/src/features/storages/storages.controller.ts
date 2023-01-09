import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { Storage } from './storage.entity';
import { CreateStorageDto, EditStorageDto, StorageIdDto } from './storage.dto';

@Controller('storages')
export class StoragesController {
  constructor(private storagesService: StoragesService) {}

  @Get()
  getMainStorages(): Promise<Storage[]> {
    return this.storagesService.getMainStorages();
  }

  @Get('my')
  getMyStorages(myId: number): Promise<Storage[]> {
    return this.storagesService.getMyStorages(myId);
  }

  @Get('all')
  getAllStorages(): Promise<Storage[]> {
    return this.storagesService.getAllStorages();
  }

  @Get('my/select')
  selectMyStorages(myId: number): Promise<Storage[]> {
    return this.storagesService.selectMyStorages(myId);
  }

  @Get('free/select')
  selectFreeStorages(): Promise<Storage[]> {
    return this.storagesService.selectFreeStorages();
  }

  @Post()
  createStorage(myId: number, @Body() dto: CreateStorageDto): Promise<void> {
    return this.storagesService.createStorage({ ...dto, myId });
  }

  @Patch(':storageId')
  editStorage(
    myId: number,
    @Param() { storageId }: StorageIdDto,
    @Body() dto: EditStorageDto,
  ): Promise<void> {
    return this.storagesService.editStorage({ ...dto, storageId, myId });
  }
}
