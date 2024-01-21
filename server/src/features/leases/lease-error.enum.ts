export enum LeaseError {
  ALREADY_COMPLETED = '400: Lease already completed',
  NOT_OWNER = '403: You are not lease owner',
  CREATE_FAILED = '500: Failed to create lease',
  CONTINUE_FAILED = '500: Failed to continue lease',
  COMPLETE_FAILED = '500: Failed to complete lease',
}
