import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId, IsRate } from '../../common/decorators';
import { IsCardExists, IsStationExists } from '../../common/constraints';
import { EditStateDto } from '../states/state.dto';

export abstract class EditDeliveryDto extends EditStateDto {}

export abstract class CreateDeliveryDto extends EditDeliveryDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class TakeDeliveryDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class RateDeliveryDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}
