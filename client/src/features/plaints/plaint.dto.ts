export interface CreatePlaintDto {
  title: string;
  userId: number;
  text: string;
}

export interface DeletePlaintDto {
  plaintId: number;
}

export interface UpdatePlaintDto extends DeletePlaintDto {
  text: string;
}
