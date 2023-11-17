import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsRentExists, IsWareExists } from '../../common/constraints';
import { CreateThingDto } from '../things/thing.dto';
import { ExtEditStateDto } from '../states/state.dto';
import { ExtCreateTradeDto } from '../trades/trade.dto';

export class WareIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsWareExists)
  @Type(() => Number)
  wareId: number;
}

export class CreateWareDto extends CreateThingDto {
  @ApiProperty()
  @IsId()
  @Validate(IsRentExists)
  rentId: number;
}

export class ExtCreateWareDto extends CreateWareDto {
  myId: number;
  hasRole: boolean;
}

export class EditWareDto extends ExtEditStateDto {}

export class ExtEditWareDto extends EditWareDto {
  wareId: number;
  myId: number;
  hasRole: boolean;
}

export class CompleteWareDto extends WareIdDto {
  myId: number;
  hasRole: boolean;
}

export class BuyWareDto extends ExtCreateTradeDto {}
