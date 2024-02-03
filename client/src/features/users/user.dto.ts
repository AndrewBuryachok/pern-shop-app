export interface EditUserProfileDto {
  userId: number;
  avatar: string;
  background: number;
  discord: string;
  twitch: string;
  youtube: string;
}

export interface EditUserPasswordDto {
  userId: number;
  password: string;
}

export interface UpdateUserRoleDto {
  userId: number;
  role: number;
}

export interface RankUserDto {
  rank: number;
}
