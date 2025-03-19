import { ApiProperty } from '@nestjs/swagger';
import { Validate, ValidateIf } from 'class-validator';
import { IsId, IsRate } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';
import { CreateThingDto } from '../things/thing.dto';

export abstract class CreateTransportationDto extends CreateThingDto {
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
