import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Good } from './good.entity';
import { ShopsModule } from '../shops/shops.module';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { IsGoodExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Good]), ShopsModule],
  controllers: [GoodsController],
  providers: [GoodsService, IsGoodExists],
})
export class GoodsModule {}
