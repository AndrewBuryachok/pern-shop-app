import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketTag } from './market-tag.entity';
import { MarketTagState } from './market-tag-state.entity';
import { MarketsModule } from '../markets/markets.module';
import { MarketsTagsController } from './markets-tags.controller';
import { MarketsTagsService } from './markets-tags.service';
import { IsMarketTagExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketTag, MarketTagState]),
    MarketsModule,
  ],
  controllers: [MarketsTagsController],
  providers: [MarketsTagsService, IsMarketTagExists],
  exports: [MarketsTagsService],
})
export class MarketsTagsModule {}
