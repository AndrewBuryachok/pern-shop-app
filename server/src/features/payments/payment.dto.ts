import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsDescription, IsId, IsSum } from '../../common/decorators';
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
  @IsDescription()
  description: string;
}

export class ExtCreatePaymentDto extends CreatePaymentDto {
  myId: number;
  hasRole: boolean;
}
