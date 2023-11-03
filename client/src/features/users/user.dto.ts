export interface EditUserPasswordDto {
  userId: number;
  password: string;
}

export interface UpdateUserRoleDto {
  userId: number;
  role: number;
}
