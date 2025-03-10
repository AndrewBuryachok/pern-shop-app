export interface UserIdDto {
  userId: number;
}

export interface EditUserProfileDto extends UserIdDto {
  nick: string;
  avatar: string;
  background: number;
  discord: string;
  twitch: string;
  youtube: string;
}

export interface EditUserPasswordDto extends UserIdDto {
  password: string;
}

export interface UpdateUserRoleDto extends UserIdDto {
  role: number;
}
