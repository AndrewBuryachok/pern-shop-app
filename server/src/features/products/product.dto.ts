import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import {
  IsCardExists,
  IsProductExists,
  IsStorageExists,
} from '../../common/constraints';
import { CreateThingDto } from '../things/thing.dto';
import { EditStateDto } from '../states/state.dto';
import { ExtCreateSaleDto } from '../sales/sale.dto';

export class ProductIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsProductExists)
  @Type(() => Number)
  productId: number;
}

export class CreateProductDto extends CreateThingDto {
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
  hasRole: boolean;
}

export class EditProductDto extends EditStateDto {}

export class ExtEditProductDto extends EditProductDto {
  productId: number;
  myId: number;
  hasRole: boolean;
}

export class BuyProductDto extends ExtCreateSaleDto {}
