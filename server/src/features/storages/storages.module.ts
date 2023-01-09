import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';
import { IsStorageExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  controllers: [StoragesController],
  providers: [StoragesService, IsStorageExists],
})
export class StoragesModule {}
