import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsRentExists, IsWareExists } from '../../common/constraints';
import { CreateThingWithAmountDto } from '../things/thing.dto';
import { ExtCreateTradeDto } from '../trades/trade.dto';

export class WareIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsWareExists)
  @Type(() => Number)
  productId: number;
}

export class CreateWareDto extends CreateThingWithAmountDto {
  @ApiProperty()
  @IsId()
  @Validate(IsRentExists)
  rentId: number;
}

export class ExtCreateWareDto extends CreateWareDto {
  myId: number;
}

export class BuyWareDto extends ExtCreateTradeDto {}
