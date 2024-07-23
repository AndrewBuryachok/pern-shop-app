import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsHireExists, IsStationExists } from '../../common/constraints';
import { CreateReceiptDto } from '../receipts/receipt.dto';

export class HireIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsHireExists)
  @Type(() => Number)
  hireId: number;
}

export class ExtHireIdDto extends HireIdDto {
  myId: number;
  hasRole: boolean;
}

export class CreateHireDto extends CreateReceiptDto {
  @ApiProperty()
  @IsId()
  @Validate(IsStationExists)
  stationId: number;
}

export class ExtCreateHireDto extends CreateHireDto {
  myId: number;
  hasRole: boolean;
}
