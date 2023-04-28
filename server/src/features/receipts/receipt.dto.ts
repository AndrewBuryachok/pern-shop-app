import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export class CreateReceiptDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}
