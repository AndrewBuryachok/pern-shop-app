import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsStationExists } from '../../common/constraints';
import {
  CreatePlaceWithPriceDto,
  EditPlaceWithPriceDto,
} from '../places/place.dto';

export class StationIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  @Type(() => Number)
  stationId: number;
}

export class CreateStationDto extends CreatePlaceWithPriceDto {}

export class ExtCreateStationDto extends CreateStationDto {
  myId: number;
  hasRole: boolean;
}

export class EditStationDto extends EditPlaceWithPriceDto {}

export class ExtEditStationDto extends EditStationDto {
  stationId: number;
  myId: number;
  hasRole: boolean;
}
