import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId } from '../../common/decorators';
import { IsLotExists } from '../../common/constraints';
import { CreatePurchaseWithPriceDto } from '../purchases/purchase.dto';

export class CreateBidDto extends CreatePurchaseWithPriceDto {
  @ApiProperty()
  @IsId()
  @Validate(IsLotExists)
  lotId: number;
}

export class ExtCreateBidDto extends CreateBidDto {
  myId: number;
  hasRole: boolean;
}
