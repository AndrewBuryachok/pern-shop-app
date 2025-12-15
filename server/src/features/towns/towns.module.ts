import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Town } from './town.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { TownsController } from './towns.controller';
import { TownsService } from './towns.service';
import { IsTownExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Town], db),
    ),
    MqttModule,
  ],
  controllers: [TownsController],
  providers: [TownsService, IsTownExists],
  exports: [TownsService],
})
export class TownsModule {}
