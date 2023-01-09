import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { RentsController } from './rents.controller';
import { RentsService } from './rents.service';
import { IsRentExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Rent])],
  controllers: [RentsController],
  providers: [RentsService, IsRentExists],
})
export class RentsModule {}
