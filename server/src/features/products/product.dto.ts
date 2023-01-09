import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsCardExists,
  IsProductExists,
  IsStorageExists,
} from '../../common/constraints';
import { CreateThingWithAmountDto } from '../things/thing.dto';
import { ExtCreateSaleDto } from '../sales/sale.dto';

export class ProductIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsProductExists)
  @Type(() => Number)
  productId: number;
}

export class CreateProductDto extends CreateThingWithAmountDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  storageId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export class ExtCreateProductDto extends CreateProductDto {
  myId: number;
}

export class BuyProductDto extends ExtCreateSaleDto {}
