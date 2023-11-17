import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsRentExists, IsStoreExists } from '../../common/constraints';
import { CreateReceiptDto } from '../receipts/receipt.dto';

export class RentIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsRentExists)
  @Type(() => Number)
  rentId: number;
}

export class CreateRentDto extends CreateReceiptDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStoreExists)
  storeId: number;
}

export class ExtCreateRentDto extends CreateRentDto {
  myId: number;
  hasRole: boolean;
}

export class CompleteRentDto extends RentIdDto {
  myId: number;
  hasRole: boolean;
}
