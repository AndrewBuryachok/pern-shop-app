import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
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

export abstract class RateTransportationDto {
  @ApiProperty()
  @IsRate()
  rate: number;
}
