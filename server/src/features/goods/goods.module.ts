import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Good } from './good.entity';
import { GoodState } from './good-state.entity';
import { ShopsModule } from '../shops/shops.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { IsGoodExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Good, GoodState], db),
    ),
    ShopsModule,
    TransactionsModule,
    MqttModule,
  ],
  controllers: [GoodsController],
  providers: [GoodsService, IsGoodExists],
  exports: [GoodsService],
})
export class GoodsModule {}
