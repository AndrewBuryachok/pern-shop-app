import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsColor, IsId, IsName } from '../../common/decorators';
import { IsCardExists } from '../../common/constraints';

export class CardIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCardExists)
  @Type(() => Number)
  cardId: number;
}

export class CreateCardDto {
  @ApiProperty()
  @IsName()
  name: string;

  @ApiProperty()
  @IsColor()
  color: number;
}

export class ExtCreateCardDto extends CreateCardDto {
  myId: number;
}

export class EditCardDto extends CreateCardDto {}

export class ExtEditCardDto extends EditCardDto {
  cardId: number;
  myId: number;
}

export class UpdateCardBalanceDto extends CardIdDto {
  sum: number;
}
