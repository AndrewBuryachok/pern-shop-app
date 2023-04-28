import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId, IsName, IsPassword, IsRole } from '../../common/decorators';
import { IsUserExists } from '../../common/constraints';

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

export class UpdateUserRoleDto {
  @ApiProperty()
  @IsRole()
  role: number;
}

export class ExtUpdateUserRoleDto extends UpdateUserRoleDto {
  userId: number;
}
