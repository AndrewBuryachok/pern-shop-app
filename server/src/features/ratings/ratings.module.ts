import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rating } from './rating.entity';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { IsRatingExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  controllers: [RatingsController],
  providers: [RatingsService, IsRatingExists],
})
export class RatingsModule {}
