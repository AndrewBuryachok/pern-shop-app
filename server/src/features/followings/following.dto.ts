import { UserIdDto } from '../users/user.dto';

export class UpdateFollowingDto extends UserIdDto {
  myId: number;
}
