export enum ReportError {
  ALREADY_VIEWED = '400: Вы уже посмотрели новость',
  NOT_OWNER = '403: Вы не владелец новости',
  CREATE_FAILED = '500: Не удалось создать новость',
  EDIT_FAILED = '500: Не удалось редактировать новость',
  DELETE_FAILED = '500: Не удалось удалить новость',
  ADD_VIEW_FAILED = '500: Не удалось добавить просмотр',
  ADD_ATTITUDE_FAILED = '500: Не удалось добавить лайк',
  UPDATE_ATTITUDE_FAILED = '500: Не удалось изменить лайк',
  REMOVE_ATTITUDE_FAILED = '500: Не удалось убрать лайк',
}
