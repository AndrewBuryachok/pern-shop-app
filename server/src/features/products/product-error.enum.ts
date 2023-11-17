export enum ProductError {
  ALREADY_EXPIRED = '400: Product already expired',
  ALREADY_COMPLETED = '400: Product already completed',
  NOT_ENOUGH_AMOUNT = '400: Product has not enough amount',
  NOT_OWNER = '403: You are not product owner',
  CREATE_FAILED = '500: Failed to create product',
  EDIT_FAILED = '500: Failed to edit product',
  COMPLETE_FAILED = '500: Failed to complete product',
  BUY_FAILED = '500: Failed to buy product',
}
