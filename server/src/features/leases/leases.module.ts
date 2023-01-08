import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/product.entity';
import { LeasesController } from './leases.controller';
import { LeasesService } from './leases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [LeasesController],
  providers: [LeasesService],
})
export class LeasesModule {}
