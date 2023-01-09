import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId } from '../../common/decorators';
import { IsStorageExists } from '../../common/constraints';

export class CreateCellDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStorageExists)
  storageId: number;
}

export class ExtCreateCellDto extends CreateCellDto {
  myId: number;
  name?: number;
}

export class ReserveCellDto {
  storageId: number;
  cardId: number;
  myId: number;
}
