import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { IsId, IsRate, IsSum } from '../../common/decorators';
import { IsCardExists, IsStationExists } from '../../common/constraints';

export abstract class EditTransportationDto {
  @ApiProperty()
  @IsSum()
  sum: number;
}

export abstract class CreateTransportationDto extends EditTransportationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class TakeTransportationDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export abstract class CompleteTransportationDto {
  @ApiProperty()
  @ValidateIf((_, value) => value !== 0)
  @IsRate()
  rate: number;
}
