import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDescription, IsId, IsSum } from '../../common/decorators';
import {
  IsCardExists,
  IsInvoiceExists,
  IsUserExists,
} from '../../common/constraints';

export class InvoiceIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsInvoiceExists)
  @Type(() => Number)
  invoiceId: number;
}

export class CreateInvoiceDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  senderCardId: number;

  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  receiverUserId: number;

  @ApiProperty()
  @IsSum()
  sum: number;

  @ApiProperty()
  @IsDescription()
  description: string;
}

export class ExtCreateInvoiceDto extends CreateInvoiceDto {
  myId: number;
}

export class CompleteInvoiceDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;
}

export class ExtCompleteInvoiceDto extends CompleteInvoiceDto {
  invoiceId: number;
  myId: number;
}

export class DeleteInvoiceDto extends InvoiceIdDto {
  myId: number;
}
