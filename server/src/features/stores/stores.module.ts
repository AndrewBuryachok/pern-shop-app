import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { IsStoreExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  controllers: [StoresController],
  providers: [StoresService, IsStoreExists],
})
export class StoresModule {}
