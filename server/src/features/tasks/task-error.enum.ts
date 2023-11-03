export enum TaskError {
  NOT_CREATED = '400: Task is not created',
  NOT_TAKEN = '400: Task is not taken',
  NOT_EXECUTED = '400: Task is not executed',
  NOT_CUSTOMER = '403: You are not task customer',
  NOT_EXECUTOR = '403: You are not task executor',
  CREATE_FAILED = '500: Failed to create task',
  TAKE_FAILED = '500: Failed to take task',
  UNTAKE_FAILED = '500: Failed to untake task',
  EXECUTE_FAILED = '500: Failed to execute task',
  COMPLETE_FAILED = '500: Failed to complete task',
  DELETE_FAILED = '500: Failed to delete task',
}
