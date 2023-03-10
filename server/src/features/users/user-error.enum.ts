export enum UserError {
  NAME_ALREADY_USED = '400: User name already used',
  ALREADY_HAS_ROLE = '400: User already has role',
  NOT_HAS_ROLE = '400: User has not role',
  ALREADY_IN_CITY = '400: User already in city',
  NOT_IN_CITY = '400: User not in city',
  CREATE_FAILED = '500: Failed to create user',
  ADD_TOKEN_FAILED = '500: Failed to add user token',
  REMOVE_TOKEN_FAILED = '500: Failed to remove user token',
  ADD_ROLE_FAILED = '500: Failed to add user role',
  REMOVE_ROLE_FAILED = '500: Failed to remove user role',
  ADD_CITY_FAILED = '500: Failed to add user city',
  REMOVE_CITY_FAILED = '500: Failed to remove user city',
}
