export enum LotError {
  ALREADY_EXPIRED = '400: Lot already expired',
  ALREADY_COMPLETED = '400: Lot already completed',
  NOT_ENOUGH_PRICE = '400: Lot has not enough price',
  NOT_OWNER = '403: You are not lot owner',
  CREATE_FAILED = '500: Failed to create lot',
  BUY_FAILED = '500: Failed to buy lot',
  COMPLETE_FAILED = '500: Failed to edit lot',
}
