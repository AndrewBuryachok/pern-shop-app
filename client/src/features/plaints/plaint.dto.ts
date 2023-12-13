export interface CreatePlaintDto {
  description: string;
  userId: number;
}

export interface DeletePlaintDto {
  plaintId: number;
}

export interface UpdatePlaintDto extends DeletePlaintDto {
  description: string;
}
