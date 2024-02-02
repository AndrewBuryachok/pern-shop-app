export enum CityError {
  ALREADY_HAS_ENOUGH = '400: User already has enough cities',
  NAME_ALREADY_USED = '400: City name already used',
  COORDINATES_ALREADY_USED = '400: City coordinates already used',
  ALREADY_IN_CITY = '400: User already in city',
  NOT_IN_CITY = '400: User not in city',
  OWNER = '400: User is city owner',
  NOT_OWNER = '403: You are not city owner',
  NOT_USER = '403: You are not city user',
  CREATE_FAILED = '500: Failed to create city',
  EDIT_FAILED = '500: Failed to edit city',
  ADD_USER_FAILED = '500: Failed to add city user',
  REMOVE_USER_FAILED = '500: Failed to remove city user',
}
