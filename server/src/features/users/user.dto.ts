import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsName, IsPassword, IsRole } from '../../common/decorators';
import { IsUserExists } from '../../common/constraints';
import { CityIdDto } from '../cities/city.dto';

export class UserIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  @Type(() => Number)
  userId: number;
}

export class CreateUserDto {
  @ApiProperty()
  @IsName()
  name: string;

  @ApiProperty()
  @IsPassword()
  password: string;
}

export class UpdateUserTokenDto extends UserIdDto {
  token?: string;
}

export class UpdateUserRolesDto {
  @ApiProperty()
  @IsRole()
  role: number;
}

export class ExtUpdateUserRolesDto extends UpdateUserRolesDto {
  userId: number;
}

export class UpdateUserCityDto extends CityIdDto {}

export class ExtUpdateUserCityDto extends UpdateUserCityDto {
  userId: number;
  myId: number;
}
