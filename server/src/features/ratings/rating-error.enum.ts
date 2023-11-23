export enum RatingError {
  ALREADY_HAS_RATING = '400: User already has rating',
  NOT_SENDER = '403: You are not rating sender',
  CREATE_FAILED = '500: Failed to create rating',
  EDIT_FAILED = '500: Failed to edit rating',
  DELETE_FAILED = '500: Failed to delete rating',
}
