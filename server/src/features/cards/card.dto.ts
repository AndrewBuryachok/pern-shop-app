import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsColor, IsId, IsName } from '../../common/decorators';
import { IsCardExists, IsUserExists } from '../../common/constraints';
import { UserIdDto } from '../users/user.dto';

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
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditCardDto extends CreateCardDto {}

export class ExtEditCardDto extends EditCardDto {
  cardId: number;
  myId: number;
  hasRole: boolean;
}

export class UpdateCardUserDto extends UserIdDto {}

export class ExtUpdateCardUserDto extends UpdateCardUserDto {
  cardId: number;
  myId: number;
  hasRole: boolean;
}

export class UpdateCardBalanceDto extends CardIdDto {
  sum: number;
}
