import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Haulage } from './haulage.entity';
import { HiresModule } from '../hires/hires.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { HaulagesController } from './haulages.controller';
import { HaulagesService } from './haulages.service';
import { IsHaulageExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Haulage]),
    HiresModule,
    CardsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [HaulagesController],
  providers: [HaulagesService, IsHaulageExists],
  exports: [HaulagesService],
})
export class HaulagesModule {}
