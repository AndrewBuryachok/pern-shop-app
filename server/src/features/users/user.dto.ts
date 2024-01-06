import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsColor,
  IsDiscordOrAvatar,
  IsId,
  IsNick,
  IsPassword,
  IsRole,
} from '../../common/decorators';
import { IsUserExists } from '../../common/constraints';

export class UserIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsUserExists)
  @Type(() => Number)
  userId: number;
}

export class EditUserProfileDto {
  @ApiProperty()
  @IsDiscordOrAvatar()
  discord: string;

  @ApiProperty()
  @IsDiscordOrAvatar()
  avatar: string;

  @ApiProperty()
  @IsColor()
  color: number;
}

export class ExtEditUserProfileDto extends EditUserProfileDto {
  userId: number;
  myId: number;
  hasRole: boolean;
}

export class EditUserPasswordDto {
  @ApiProperty()
  @IsPassword()
  password: string;
}

export class ExtEditUserPasswordDto extends EditUserPasswordDto {
  userId: number;
}

export class CreateUserDto extends EditUserPasswordDto {
  @ApiProperty()
  @IsNick()
  nick: string;
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

export class UpdateUserFriendDto {
  senderUserId: number;
  receiverUserId: number;
}

export class UpdateUserSubscriberDto {
  senderUserId: number;
  receiverUserId: number;
}
