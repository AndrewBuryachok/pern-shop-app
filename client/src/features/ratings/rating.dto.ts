export interface CreateRatingDto {
  receiverUserId: number;
  rate: number;
}

export interface ExtCreateRatingDto extends CreateRatingDto {
  senderUserId: number;
}

export interface DeleteRatingDto {
  ratingId: number;
}

export interface EditRatingDto extends DeleteRatingDto {
  rate: number;
}
