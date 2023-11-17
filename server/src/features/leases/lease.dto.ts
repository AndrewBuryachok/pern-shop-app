import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsKind } from '../../common/decorators';
import { IsLeaseExists, IsStorageExists } from '../../common/constraints';
import { CreateReceiptDto } from '../receipts/receipt.dto';

export class LeaseIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsLeaseExists)
  @Type(() => Number)
  leaseId: number;
}

export class CreateLeaseDto extends CreateReceiptDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  storageId: number;

  @ApiProperty()
  @IsKind()
  kind: number;
}

export class ExtCreateLeaseDto extends CreateLeaseDto {
  myId: number;
  hasRole: boolean;
}

export class CompleteLeaseDto extends LeaseIdDto {
  myId: number;
  hasRole: boolean;
}
