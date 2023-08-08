import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId } from '../../common/decorators';
import { IsStorageExists } from '../../common/constraints';
import { CreateReceiptDto } from '../receipts/receipt.dto';

export class CreateLeaseDto extends CreateReceiptDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  storageId: number;
}

export class ExtCreateLeaseDto extends CreateLeaseDto {
  myId: number;
  hasRole: boolean;
}
