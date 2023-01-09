export enum MarketError {
  ALREADY_HAS_ENOUGH = '400: User already has enough markets',
  NAME_ALREADY_USED = '400: Market name already used',
  COORDINATES_ALREADY_USED = '400: Market coordinates already used',
  NOT_OWNER = '403: You are not market owner',
  CREATE_FAILED = '500: Failed to create market',
  EDIT_FAILED = '500: Failed to edit market',
}
