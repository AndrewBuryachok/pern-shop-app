export interface AuthDto {
  name: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
