import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stall } from './stall.entity';
import { MarketsTagsModule } from '../markets-tags/markets-tags.module';
import { PaymentsModule } from '../payments/payments.module';
import { StallsController } from './stalls.controller';
import { StallsService } from './stalls.service';
import { IsStallExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stall]),
    MarketsTagsModule,
    PaymentsModule,
  ],
  controllers: [StallsController],
  providers: [StallsService, IsStallExists],
  exports: [StallsService],
})
export class StallsModule {}
