export enum ReportError {
  ALREADY_VIEWED = '400: Ви уже переглянули новину',
  NOT_OWNER = '403: Ви не власник новини',
  CREATE_FAILED = '500: Не вдалося створити новину',
  EDIT_FAILED = '500: Не вдалося редагувати новину',
  DELETE_FAILED = '500: Не вдалося видалити новину',
  ADD_VIEW_FAILED = '500: Не вдалося додати перегляд',
  ADD_LIKE_FAILED = '500: Не вдалося додати вподобання',
  UPDATE_LIKE_FAILED = '500: Не вдалося оновити вподобання',
  REMOVE_LIKE_FAILED = '500: Не вдалося прибрати вподобання',
}
