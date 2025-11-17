export enum ReportError {
  ALREADY_VIEWED = '400: Ви уже переглянули звіт',
  NOT_OWNER = '403: Ви не власник звіту',
  CREATE_FAILED = '500: Не вдалося створити звіт',
  EDIT_FAILED = '500: Не вдалося редагувати звіт',
  DELETE_FAILED = '500: Не вдалося видалити звіт',
  ADD_VIEW_FAILED = '500: Не вдалося додати перегляд',
  ADD_LIKE_FAILED = '500: Не вдалося додати вподобання',
  UPDATE_LIKE_FAILED = '500: Не вдалося оновити вподобання',
  REMOVE_LIKE_FAILED = '500: Не вдалося прибрати вподобання',
}
