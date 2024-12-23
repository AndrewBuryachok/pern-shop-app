export enum TownError {
  NAME_ALREADY_USED = '400: Town name already used',
  COORDINATES_ALREADY_USED = '400: Town coordinates already used',
  NOT_HAVE = '400: You do not have any town',
  ALREADY_IN = '400: User already in some town',
  NOT_IN = '400: User not in any town',
  NOT_OWNER = '403: You are not town owner',
  CREATE_FAILED = '500: Failed to create town',
  EDIT_FAILED = '500: Failed to edit town',
  DELETE_FAILED = '500: Failed to delete town',
}
