import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId, IsOptionalDescription, IsSum } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export class CreatePaymentDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  senderCardId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  receiverCardId: number;

  @ApiProperty()
  @IsSum()
  sum: number;

  @ApiProperty()
  @IsOptionalDescription()
  description: string;
}

export class ExtCreatePaymentDto extends CreatePaymentDto {
  myId: number;
  hasRole: boolean;
}
