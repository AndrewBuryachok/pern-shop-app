export enum UserError {
  NICK_ALREADY_USED = '400: User nick already used',
  ALREADY_HAS_ROLE = '400: User already has role',
  NOT_HAS_ROLE = '400: User has not role',
  CREATE_FAILED = '500: Failed to create user',
  ADD_TOKEN_FAILED = '500: Failed to add user token',
  REMOVE_TOKEN_FAILED = '500: Failed to remove user token',
  UPDATE_PASSWORD_FAILED = '500: Failed to update user password',
  ADD_ROLE_FAILED = '500: Failed to add user role',
  REMOVE_ROLE_FAILED = '500: Failed to remove user role',
}
