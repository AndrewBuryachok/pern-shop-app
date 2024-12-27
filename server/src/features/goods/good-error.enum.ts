export enum GoodError {
  ALREADY_EXPIRED = '400: Good already expired',
  ALREADY_COMPLETED = '400: Good already completed',
  NOT_ENOUGH_AMOUNT = '400: Good has not enough amount',
  NOT_OWNER = '403: You are not good owner',
  CREATE_SHOP_FAILED = '500: Failed to create shop good',
  CREATE_MARKET_FAILED = '500: Failed to create market good',
  CREATE_STORAGE_FAILED = '500: Failed to create storage good',
  EDIT_FAILED = '500: Failed to edit good',
  COMPLETE_FAILED = '500: Failed to complete good',
  BUY_FAILED = '500: Failed to buy good',
}
