import { ApiProperty } from '@nestjs/swagger';
import { Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsId } from '../../common/decorators';
import { IsFriendExists } from '../../common/constraints';
import { UserIdDto } from '../users/user.dto';

export class FriendIdDto {
  @ApiProperty()
  @IsId()
  @Validate(IsFriendExists)
  @Type(() => Number)
  friendId: number;
}

export class CreateFriendDto extends UserIdDto {}

export class ExtCreateFriendDto extends CreateFriendDto {
  myId: number;
}

export class UpdateFriendDto extends FriendIdDto {
  myId: number;
}
