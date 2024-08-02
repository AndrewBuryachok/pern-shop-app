import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { IsPaymentExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), CardsModule, MqttModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, IsPaymentExists],
  exports: [PaymentsService],
})
export class PaymentsModule {}
