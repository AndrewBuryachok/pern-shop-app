export enum RentError {
  ALREADY_EXPIRED = '400: Rent already expired',
  ALREADY_COMPLETED = '400: Rent already completed',
  NOT_OWNER = '403: You are not rent owner',
  CREATE_FAILED = '500: Failed to create rent',
  COMPLETE_FAILED = '500: Failed to complete rent',
}
