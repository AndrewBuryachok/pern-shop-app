export interface CreateRatingDto {
  userId: number;
  rate: number;
}

export interface DeleteRatingDto {
  ratingId: number;
}

export interface EditRatingDto extends DeleteRatingDto {
  rate: number;
}
