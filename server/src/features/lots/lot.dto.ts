import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsCardExists,
  IsLotExists,
  IsStorageExists,
} from '../../common/constraints';
import { CreateThingDto } from '../things/thing.dto';
import { ExtCreateBidDto } from '../bids/bid.dto';

export class LotIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsLotExists)
  @Type(() => Number)
  lotId: number;
}

export class CreateLotDto extends CreateThingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  storageId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export class ExtCreateLotDto extends CreateLotDto {
  myId: number;
  hasRole: boolean;
}

export class BuyLotDto extends ExtCreateBidDto {}

export class CompleteLotDto extends LotIdDto {
  myId: number;
  hasRole: boolean;
}
