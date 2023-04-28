export enum WareError {
  ALREADY_EXPIRED = '400: Ware already expired',
  NOT_ENOUGH_AMOUNT = '400: Ware has not enough amount',
  NOT_OWNER = '403: You are not ware owner',
  CREATE_FAILED = '500: Failed to create ware',
  EDIT_FAILED = '500: Failed to edit ware',
  BUY_FAILED = '500: Failed to buy ware',
}
