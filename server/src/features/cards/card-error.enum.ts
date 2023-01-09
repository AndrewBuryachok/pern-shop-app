export enum CardError {
  ALREADY_HAS_ENOUGH = '400: User already has enough cards',
  NAME_ALREADY_USED = '400: Card name already used',
  ALREADY_ENOUGH_BALANCE = '400: Card already has enough balance',
  NOT_ENOUGH_BALANCE = '400: Card has not enough balance',
  NOT_OWNER = '403: You are not card owner',
  CREATE_FAILED = '500: Failed to create card',
  EDIT_FAILED = '500: Failed to edit card',
  INCREASE_BALANCE_FAILED = '500: Failed to increase card balance',
  REDUCE_BALANCE_FAILED = '500: Failed to reduce card balance',
}
