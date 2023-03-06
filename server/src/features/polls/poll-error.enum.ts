export enum PollError {
  ALREADY_COMPLETED = '400: Poll already completed',
  NOT_OWNER = '403: You are not poll owner',
  CREATE_FAILED = '500: Failed to create poll',
  COMPLETE_FAILED = '500: Failed to complete poll',
  DELETE_FAILED = '500: Failed to delete poll',
}
