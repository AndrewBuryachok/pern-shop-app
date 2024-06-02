export interface CreatePlaintDto {
  receiverUserId: number;
  title: string;
  text: string;
}

export interface ExtCreatePlaintDto extends CreatePlaintDto {
  senderUserId: number;
}

export interface DeletePlaintDto {
  plaintId: number;
}

export interface EditPlaintDto extends DeletePlaintDto {
  title: string;
}
export interface CompletePlaintDto extends DeletePlaintDto {
  text: string;
}
