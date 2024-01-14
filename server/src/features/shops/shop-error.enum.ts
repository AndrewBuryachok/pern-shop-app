export enum ShopError {
  ALREADY_HAS_ENOUGH = '400: User already has enough shops',
  NAME_ALREADY_USED = '400: Shop name already used',
  COORDINATES_ALREADY_USED = '400: Shop coordinates already used',
  ALREADY_IN_SHOP = '400: User already in shop',
  NOT_IN_SHOP = '400: User not in shop',
  OWNER = '400: You are shop owner',
  NOT_OWNER = '403: You are not shop owner',
  NOT_USER = '403: You are not shop user',
  CREATE_FAILED = '500: Failed to create shop',
  EDIT_FAILED = '500: Failed to edit shop',
  ADD_USER_FAILED = '500: Failed to add shop user',
  REMOVE_USER_FAILED = '500: Failed to remove shop user',
}
