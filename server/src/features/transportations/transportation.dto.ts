import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { IsId, IsRate } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

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
