export enum ReportError {
  ALREADY_VIEWED = '400: You already viewed report',
  NOT_OWNER = '403: You are not report owner',
  CREATE_FAILED = '500: Failed to create report',
  EDIT_FAILED = '500: Failed to edit report',
  DELETE_FAILED = '500: Failed to delete report',
  ADD_VIEW_FAILED = '500: Failed to add view',
  ADD_LIKE_FAILED = '500: Failed to add like',
  UPDATE_LIKE_FAILED = '500: Failed to update like',
  REMOVE_LIKE_FAILED = '500: Failed to remove like',
}
