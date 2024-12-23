import { TownIdDto } from '../towns/town.dto';
import { UserIdDto } from '../users/user.dto';

export class UpdateResidentByTownDto extends TownIdDto {
  myId: number;
}

export class UpdateResidentByUserDto extends UserIdDto {
  myId: number;
}
