export enum PlaintError {
  ALREADY_EXECUTED = '400: Plaint already executed',
  ALREADY_COMPLETED = '400: Plaint already completed',
  NOT_SENDER = '403: You are not plaint sender',
  NOT_RECEIVER = '403: You are not plaint receiver',
  CREATE_FAILED = '500: Failed to create plaint',
  EXECUTE_FAILED = '500: Failed to execute plaint',
  COMPLETE_FAILED = '500: Failed to complete plaint',
  DELETE_FAILED = '500: Failed to delete plaint',
}
