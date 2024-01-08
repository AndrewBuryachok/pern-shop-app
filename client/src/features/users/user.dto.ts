export interface EditUserProfileDto {
  userId: number;
  discord: string;
  avatar: string;
  background: number;
}

export interface EditUserPasswordDto {
  userId: number;
  password: string;
}

export interface UpdateUserRoleDto {
  userId: number;
  role: number;
}
