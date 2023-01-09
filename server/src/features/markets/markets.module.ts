import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './market.entity';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';
import { IsMarketExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  controllers: [MarketsController],
  providers: [MarketsService, IsMarketExists],
})
export class MarketsModule {}
