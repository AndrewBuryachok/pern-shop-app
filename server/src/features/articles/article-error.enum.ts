export enum ArticleError {
  NOT_OWNER = '403: You are not article owner',
  CREATE_FAILED = '500: Failed to create article',
  EDIT_FAILED = '500: Failed to edit article',
  DELETE_FAILED = '500: Failed to delete article',
  ADD_LIKE_FAILED = '500: Failed to add like',
  UPDATE_LIKE_FAILED = '500: Failed to update like',
  REMOVE_LIKE_FAILED = '500: Failed to remove like',
}
