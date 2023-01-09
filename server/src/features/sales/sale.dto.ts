import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId } from '../../common/decorators';
import { IsProductExists } from '../../common/constraints';
import { CreatePurchaseDto } from '../purchases/purchase.dto';

export class CreateSaleDto extends CreatePurchaseDto {
  @ApiProperty()
  @IsId()
  @Validate(IsProductExists)
  productId: number;
}

export class ExtCreateSaleDto extends CreateSaleDto {
  myId: number;
}
