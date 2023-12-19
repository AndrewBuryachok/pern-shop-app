import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsOptionalDescription, IsSum } from '../../common/decorators';
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
  @IsOptionalDescription()
  description: string;
}

export class ExtCreateInvoiceDto extends CreateInvoiceDto {
  myId: number;
  hasRole: boolean;
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
  hasRole: boolean;
}

export class DeleteInvoiceDto extends InvoiceIdDto {
  myId: number;
  hasRole: boolean;
}
