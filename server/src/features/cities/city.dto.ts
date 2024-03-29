import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsCityExists, IsUserExists } from '../../common/constraints';
import { CreatePlaceDto, EditPlaceDto } from '../places/place.dto';
import { UserIdDto } from '../users/user.dto';

export class CityIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsCityExists)
  @Type(() => Number)
  cityId: number;
}

export class CreateCityDto extends CreatePlaceDto {}

export class ExtCreateCityDto extends CreateCityDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  userId: number;
}

export class EditCityDto extends EditPlaceDto {}

export class ExtEditCityDto extends EditCityDto {
  cityId: number;
  myId: number;
  hasRole: boolean;
}

export class UpdateCityUserDto extends UserIdDto {}

export class ExtUpdateCityUserDto extends UpdateCityUserDto {
  cityId: number;
  myId: number;
  hasRole: boolean;
}
