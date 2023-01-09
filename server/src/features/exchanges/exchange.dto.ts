import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { IsId, IsSum, IsType } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

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
