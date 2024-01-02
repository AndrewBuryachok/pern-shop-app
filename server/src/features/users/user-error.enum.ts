export enum UserError {
  NICK_ALREADY_USED = '400: User nick already used',
  ALREADY_HAS_ROLE = '400: User already has role',
  NOT_HAS_ROLE = '400: User has not role',
  ALREADY_HAS_FRIEND = '400: User already has friend',
  NOT_HAS_FRIEND = '400: User has not friend',
  ALREADY_HAS_SUBSCRIBER = '400: User already has subscriber',
  NOT_HAS_SUBSCRIBER = '400: User has not subscriber',
  CREATE_FAILED = '500: Failed to create user',
  ADD_TOKEN_FAILED = '500: Failed to add user token',
  REMOVE_TOKEN_FAILED = '500: Failed to remove user token',
  ADD_TYPE_FAILED = '500: Failed to add user type',
  REMOVE_TYPE_FAILED = '500: Failed to remove user type',
  UPDATE_PASSWORD_FAILED = '500: Failed to update user password',
  ADD_ROLE_FAILED = '500: Failed to add user role',
  REMOVE_ROLE_FAILED = '500: Failed to remove user role',
  ADD_FRIEND_FAILED = '500: Failed to add user friend',
  REMOVE_FRIEND_FAILED = '500: Failed to remove user friend',
  ADD_SUBSCRIBER_FAILED = '500: Failed to add user subscriber',
  REMOVE_SUBSCRIBER_FAILED = '500: Failed to remove user subscriber',
}
