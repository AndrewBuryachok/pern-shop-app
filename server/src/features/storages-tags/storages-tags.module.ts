import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageTag } from './storage-tag.entity';
import { StorageTagState } from './storage-tag-state.entity';
import { StoragesModule } from '../storages/storages.module';
import { StoragesTagsController } from './storages-tags.controller';
import { StoragesTagsService } from './storages-tags.service';
import { IsStorageTagExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageTag, StorageTagState]),
    StoragesModule,
  ],
  controllers: [StoragesTagsController],
  providers: [StoragesTagsService, IsStorageTagExists],
  exports: [StoragesTagsService],
})
export class StoragesTagsModule {}
