import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsBackground,
  IsContact,
  IsId,
  IsNick,
  IsPassword,
  IsRank,
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

export class UserNickDto {
  @ApiProperty()
  @IsNick()
  nick: string;
}

export class EditUserProfileDto {
  @ApiProperty()
  @IsContact()
  avatar: string;

  @ApiProperty()
  @IsBackground()
  background: number;

  @ApiProperty()
  @IsContact()
  discord: string;

  @ApiProperty()
  @IsContact()
  twitch: string;

  @ApiProperty()
  @IsContact()
  youtube: string;
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

export class UpdateUserIgnorerDto {
  senderUserId: number;
  receiverUserId: number;
}

export class RankUserDto {
  @ApiProperty()
  @IsRank()
  rank: number;
}

export class ExtRankUserDto extends RankUserDto {
  myId: number;
}
