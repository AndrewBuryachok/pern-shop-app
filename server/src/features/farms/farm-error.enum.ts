export enum FarmError {
  NAME_ALREADY_USED = '400: Farm name already used',
  COORDINATES_ALREADY_USED = '400: Farm coordinates already used',
  ALREADY_IN_FARM = '400: User already in farm',
  NOT_IN_FARM = '400: User not in farm',
  OWNER = '400: User is farm owner',
  NOT_OWNER = '403: You are not farm owner',
  NOT_USER = '403: You are not farm user',
  CREATE_FAILED = '500: Failed to create farm',
  EDIT_FAILED = '500: Failed to edit farm',
  ADD_USER_FAILED = '500: Failed to add farm user',
  REMOVE_USER_FAILED = '500: Failed to remove farm user',
}
