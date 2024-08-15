import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsFarmExists, IsUserExists } from '../../common/constraints';
import { CreatePlaceDto } from '../places/place.dto';
import { UserIdDto } from '../users/user.dto';

export class FarmIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsFarmExists)
  @Type(() => Number)
  farmId: number;
}

export class CreateFarmDto extends CreatePlaceDto {}

export class ExtCreateFarmDto extends CreateFarmDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditFarmDto extends CreatePlaceDto {}

export class ExtEditFarmDto extends EditFarmDto {
  farmId: number;
  myId: number;
  hasRole: boolean;
}

export class UpdateFarmUserDto extends UserIdDto {}

export class ExtUpdateFarmUserDto extends UpdateFarmUserDto {
  farmId: number;
  myId: number;
  hasRole: boolean;
}
