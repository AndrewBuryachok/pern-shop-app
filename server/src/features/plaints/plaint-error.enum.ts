export enum PlaintError {
  NOT_CREATED = '400: Plaint is not created',
  NOT_EXECUTED = '400: Plaint is not executed',
  NOT_SENDER = '403: You are not plaint sender',
  NOT_RECEIVER = '403: You are not plaint receiver',
  CREATE_FAILED = '500: Failed to create plaint',
  EXECUTE_FAILED = '500: Failed to execute plaint',
  COMPLETE_FAILED = '500: Failed to complete plaint',
  DELETE_FAILED = '500: Failed to delete plaint',
}
