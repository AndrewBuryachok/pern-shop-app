export enum ShopError {
  ALREADY_HAS_ENOUGH = '400: User already has enough shops',
  NAME_ALREADY_USED = '400: Shop name already used',
  COORDINATES_ALREADY_USED = '400: Shop coordinates already used',
  NOT_OWNER = '403: You are not shop owner',
  CREATE_FAILED = '500: Failed to create shop',
  EDIT_FAILED = '500: Failed to edit shop',
}
