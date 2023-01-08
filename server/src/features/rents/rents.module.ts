import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { RentsController } from './rents.controller';
import { RentsService } from './rents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rent])],
  controllers: [RentsController],
  providers: [RentsService],
})
export class RentsModule {}
