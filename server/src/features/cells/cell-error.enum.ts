export enum CellError {
  ALREADY_HAS_ENOUGH = '400: Storage already has enough cells',
  NO_FREE = '404: No free cells',
  CREATE_FAILED = '500: Failed to create cell',
  RESERVE_FAILED = '500: Failed to reserve cell',
  CONTINUE_FAILED = '500: Failed to continue cell',
  UNRESERVE_FAILED = '500: Failed to unreserve cell',
}
