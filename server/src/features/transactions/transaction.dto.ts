import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDescription, IsId, IsSum } from '../../common/decorators';
import { IsCardExists, IsTransactionExists } from '../../common/constraints';
import { Item } from '../things/item.enum';

export class TransactionIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTransactionExists)
  @Type(() => Number)
  transactionId: number;
}

export class CreateTransactionDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsSum()
  sum: number;
}

export class CreateTransactionWithDescriptionDto extends CreateTransactionDto {
  description: string;
  item?: Item;
}

export class CreateTransferDto {
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

export class ExtCreateTransferDto extends CreateTransferDto {
  item?: Item;
  myId: number;
  hasRole: boolean;
}
