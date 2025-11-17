export enum ArticleError {
  ALREADY_VIEWED = '400: Ви уже переглянули статтю',
  NOT_OWNER = '403: Ви не власник статті',
  CREATE_FAILED = '500: Не вдалося створити статтю',
  EDIT_FAILED = '500: Не вдалося редагувати статтю',
  DELETE_FAILED = '500: Не вдалося видалити статтю',
  ADD_VIEW_FAILED = '500: Не вдалося додати перегляд',
  ADD_LIKE_FAILED = '500: Не вдалося додати вподобання',
  UPDATE_LIKE_FAILED = '500: Не вдалося оновити вподобання',
  REMOVE_LIKE_FAILED = '500: Не вдалося прибрати вподобання',
}
