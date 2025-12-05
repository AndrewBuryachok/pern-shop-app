import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsSum, IsType } from '../../common/decorators';
import { IsCardExists, IsExchangeExists } from '../../common/constraints';

export class ExchangeIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsExchangeExists)
  @Type(() => Number)
  exchangeId: number;
}

export class CreateExchangeDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  cardId: number;

  @ApiProperty()
  @IsType()
  type: boolean;

  @ApiProperty()
  @IsSum()
  sum: number;
}

export class ExtCreateExchangeDto extends CreateExchangeDto {
  myId: number;
}
