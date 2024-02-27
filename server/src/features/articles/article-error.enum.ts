export enum ArticleError {
  ALREADY_VIEWED = '400: Вы уже посмотрели публикацию',
  NOT_OWNER = '403: Вы не владелец публикации',
  CREATE_FAILED = '500: Не удалось создать публикацию',
  EDIT_FAILED = '500: Не удалось редактировать публикацию',
  DELETE_FAILED = '500: Не удалось удалить публикацию',
  ADD_VIEW_FAILED = '500: Не удалось добавить просмотр',
  ADD_LIKE_FAILED = '500: Не удалось добавить реакцию',
  UPDATE_LIKE_FAILED = '500: Не удалось изменить реакцию',
  REMOVE_LIKE_FAILED = '500: Не удалось убрать реакцию',
}
