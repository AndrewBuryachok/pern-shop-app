import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';
import { LotsModule } from '../lots/lots.module';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bid]), LotsModule],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
