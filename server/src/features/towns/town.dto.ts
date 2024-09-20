import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsTownExists, IsUserExists } from '../../common/constraints';
import { CreatePlaceDto } from '../places/place.dto';
import { UserIdDto } from '../users/user.dto';

export class TownIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsTownExists)
  @Type(() => Number)
  townId: number;
}

export class CreateTownDto extends CreatePlaceDto {}

export class ExtCreateTownDto extends CreateTownDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditTownDto extends CreatePlaceDto {}

export class ExtEditTownDto extends EditTownDto {
  townId: number;
  myId: number;
  hasRole: boolean;
}

export class UpdateTownUserDto extends UserIdDto {}

export class ExtUpdateTownUserDto extends UpdateTownUserDto {
  townId: number;
  myId: number;
  hasRole: boolean;
}
