import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId, IsRate } from '../../common/decorators';
import { IsCardExists, IsStationExists } from '../../common/constraints';
import { EditStateDto } from '../states/state.dto';

export abstract class EditHaulageDto extends EditStateDto {}

export abstract class CreateHaulageDto extends EditHaulageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class TakeHaulageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class RateHaulageDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}
