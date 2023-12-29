import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Storage } from './storage.entity';
import { StorageState } from './storage-state.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';
import { IsStorageExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Storage, StorageState]),
    CardsModule,
    MqttModule,
  ],
  controllers: [StoragesController],
  providers: [StoragesService, IsStorageExists],
  exports: [StoragesService],
})
export class StoragesModule {}
