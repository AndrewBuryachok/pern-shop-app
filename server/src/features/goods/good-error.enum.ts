export enum GoodError {
  ALREADY_COMPLETED = '400: Good already completed',
  NOT_ENOUGH_AMOUNT = '400: Good has not enough amount',
  NOT_OWNER = '403: You are not good owner',
  CREATE_FAILED = '500: Failed to create good',
  EDIT_FAILED = '500: Failed to edit good',
  COMPLETE_FAILED = '500: Failed to complete good',
  BUY_FAILED = '500: Failed to buy good',
}
