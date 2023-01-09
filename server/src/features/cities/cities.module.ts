import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './city.entity';
import { UsersModule } from '../users/users.module';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { IsCityExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([City]), forwardRef(() => UsersModule)],
  controllers: [CitiesController],
  providers: [CitiesService, IsCityExists],
  exports: [CitiesService],
})
export class CitiesModule {}
