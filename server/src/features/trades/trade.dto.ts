import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId } from '../../common/decorators';
import { IsWareExists } from '../../common/constraints';
import { CreatePurchaseDto } from '../purchases/purchase.dto';

export class CreateTradeDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsWareExists)
  wareId: number;
}

export class ExtCreateTradeDto extends CreateTradeDto {
  myId: number;
}
