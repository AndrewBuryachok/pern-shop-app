import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsMarketTagExists, IsStallExists } from '../../common/constraints';
import { ExtCreateRentDto } from '../rents/rent.dto';

export class StallIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStallExists)
  @Type(() => Number)
  stallId: number;
}

export class CreateStallDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMarketTagExists)
  marketTagId: number;
}

export class ExtCreateStallDto extends CreateStallDto {
  myId: number;
  hasRole: boolean;
  marketId?: number;
  name?: number;
}

export class ReserveStallDto extends ExtCreateRentDto {}
