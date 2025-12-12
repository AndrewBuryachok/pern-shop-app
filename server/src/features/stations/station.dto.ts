import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsStationExists, IsUserExists } from '../../common/constraints';
import { CreatePlaceDto } from '../places/place.dto';

export class StationIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  @Type(() => Number)
  stationId: number;
}

export class CreateStationDto extends CreatePlaceDto {}

export class ExtCreateStationDto extends CreateStationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditStationDto extends CreatePlaceDto {}

export class ExtEditStationDto extends EditStationDto {
  stationId: number;
  myId: number;
  hasRole: boolean;
}
