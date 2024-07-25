import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId, IsPrice, IsRate } from '../../common/decorators';
import { IsCardExists, IsStationExists } from '../../common/constraints';

export abstract class TakeHaulageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class CreateHaulageDto extends TakeHaulageDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;

  @ApiProperty()
  @IsPrice()
  price: number;
}

export abstract class RateHaulageDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}
