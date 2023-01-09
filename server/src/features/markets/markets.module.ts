import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './market.entity';
import { CardsModule } from '../cards/cards.module';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';
import { IsMarketExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Market]), CardsModule],
  controllers: [MarketsController],
  providers: [MarketsService, IsMarketExists],
  exports: [MarketsService],
})
export class MarketsModule {}
