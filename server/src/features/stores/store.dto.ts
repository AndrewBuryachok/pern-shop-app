import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsMarketTagExists, IsStoreExists } from '../../common/constraints';
import { ExtCreateRentDto } from '../rents/rent.dto';

export class StoreIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStoreExists)
  @Type(() => Number)
  storeId: number;
}

export class CreateStoreDto {
  @ApiProperty()
  @IsId()
  @Validate(IsMarketTagExists)
  marketTagId: number;
}

export class ExtCreateStoreDto extends CreateStoreDto {
  myId: number;
  hasRole: boolean;
  marketId?: number;
  name?: number;
}

export class ReserveStoreDto extends ExtCreateRentDto {}
