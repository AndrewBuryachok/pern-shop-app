export enum TownError {
  NAME_ALREADY_USED = '400: Town name already used',
  COORDINATES_ALREADY_USED = '400: Town coordinates already used',
  ALREADY_IN_TOWN = '400: User already in town',
  NOT_IN_TOWN = '400: User not in town',
  OWNER = '400: User is town owner',
  NOT_OWNER = '403: You are not town owner',
  NOT_USER = '403: You are not town user',
  CREATE_FAILED = '500: Failed to create town',
  EDIT_FAILED = '500: Failed to edit town',
  ADD_USER_FAILED = '500: Failed to add town user',
  REMOVE_USER_FAILED = '500: Failed to remove town user',
}
