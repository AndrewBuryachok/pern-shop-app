import { Controller, Get } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { Storage } from './storage.entity';

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
}
