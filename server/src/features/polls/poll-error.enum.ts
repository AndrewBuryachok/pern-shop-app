export enum PollError {
  ALREADY_COMPLETED = '400: Poll already completed',
  ALREADY_VIEWED = '400: You already viewed poll',
  NOT_OWNER = '403: You are not poll owner',
  CREATE_FAILED = '500: Failed to create poll',
  EDIT_FAILED = '500: Failed to edit poll',
  COMPLETE_FAILED = '500: Failed to complete poll',
  DELETE_FAILED = '500: Failed to delete poll',
  ADD_VIEW_FAILED = '500: Failed to add view',
  ADD_VOTE_FAILED = '500: Failed to add vote',
  UPDATE_VOTE_FAILED = '500: Failed to update vote',
  REMOVE_VOTE_FAILED = '500: Failed to remove vote',
}
