import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsMarketExists, IsStoreExists } from '../../common/constraints';

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
  @Validate(IsMarketExists)
  marketId: number;
}

export class ExtCreateStoreDto extends CreateStoreDto {
  myId: number;
  name?: number;
}

export class ReserveStoreDto {
  storeId: number;
  cardId: number;
  myId: number;
}
