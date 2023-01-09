import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { WaresModule } from '../wares/wares.module';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trade]), WaresModule],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
