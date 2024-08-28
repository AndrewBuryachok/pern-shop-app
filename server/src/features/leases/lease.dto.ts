import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsCellExists, IsLeaseExists } from '../../common/constraints';
import { CreateReceiptDto } from '../receipts/receipt.dto';

export class LeaseIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsLeaseExists)
  @Type(() => Number)
  leaseId: number;
}

export class ExtLeaseIdDto extends LeaseIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateLeaseDto extends CreateReceiptDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCellExists)
  cellId: number;
}

export class ExtCreateLeaseDto extends CreateLeaseDto {
  myId: number;
  hasRole: boolean;
}
