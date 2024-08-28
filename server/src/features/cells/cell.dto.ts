import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsCellExists, IsStorageTagExists } from '../../common/constraints';
import { ExtCreateLeaseDto } from '../leases/lease.dto';

export class CellIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCellExists)
  @Type(() => Number)
  cellId: number;
}

export class CreateCellDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageTagExists)
  storageTagId: number;
}

export class ExtCreateCellDto extends CreateCellDto {
  myId: number;
  hasRole: boolean;
  storageId?: number;
  name?: number;
}

export class ReserveCellDto extends ExtCreateLeaseDto {}
