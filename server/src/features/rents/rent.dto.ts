import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsCardExists,
  IsRentExists,
  IsStoreExists,
} from '../../common/constraints';

export class RentIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsRentExists)
  @Type(() => Number)
  rentId: number;
}

export class CreateRentDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStoreExists)
  storeId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export class ExtCreateRentDto extends CreateRentDto {
  myId: number;
}
