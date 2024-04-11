import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId } from '../../common/decorators';
import { IsStorageTagExists } from '../../common/constraints';

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

export class ReserveCellDto {
  storageTagId: number;
  cardId: number;
  myId: number;
  hasRole: boolean;
}
