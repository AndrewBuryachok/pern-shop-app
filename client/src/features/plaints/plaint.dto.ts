export interface CreatePlaintDto {
  title: string;
  receiverUserId: number;
  text: string;
}

export interface ExtCreatePlaintDto extends CreatePlaintDto {
  senderUserId: number;
}

export interface DeletePlaintDto {
  plaintId: number;
}

export interface UpdatePlaintDto extends DeletePlaintDto {
  text: string;
}
