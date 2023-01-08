import { Module } from '@nestjs/common';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';

@Module({
  controllers: [StoragesController],
  providers: [StoragesService],
})
export class StoragesModule {}
