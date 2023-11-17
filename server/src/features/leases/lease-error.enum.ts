export enum LeaseError {
  ALREADY_EXPIRED = '400: Lease already expired',
  ALREADY_COMPLETED = '400: Lease already completed',
  NOT_OWNER = '403: You are not lease owner',
  CREATE_FAILED = '500: Failed to create lease',
  COMPLETE_FAILED = '500: Failed to complete lease',
}
