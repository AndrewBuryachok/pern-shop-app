export interface CreateAnswerDto {
  plaintId: number;
  text: string;
}

export interface DeleteAnswerDto {
  answerId: number;
}

export interface EditAnswerDto extends DeleteAnswerDto {
  text: string;
}
