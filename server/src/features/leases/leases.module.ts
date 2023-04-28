import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lease } from './lease.entity';
import { CellsModule } from '../cells/cells.module';
import { LeasesController } from './leases.controller';
import { LeasesService } from './leases.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lease]), CellsModule],
  controllers: [LeasesController],
  providers: [LeasesService],
  exports: [LeasesService],
})
export class LeasesModule {}
