export enum PollError {
  ALREADY_COMPLETED = '400: Ідею вже завершено',
  ALREADY_VIEWED = '400: Ви уже переглянули ідею',
  NOT_OWNER = '403: Ви не власник ідеї',
  CREATE_FAILED = '500: Не вдалося створити ідею',
  EDIT_FAILED = '500: Не вдалося редагувати ідею',
  COMPLETE_FAILED = '500: Не вдалося завершити ідею',
  DELETE_FAILED = '500: Не вдалося видалити ідею',
  ADD_VIEW_FAILED = '500: Не вдалося додати перегляд',
  ADD_LIKE_FAILED = '500: Не вдалося додати вподобання',
  UPDATE_LIKE_FAILED = '500: Не вдалося оновити вподобання',
  REMOVE_LIKE_FAILED = '500: Не вдалося прибрати вподобання',
}
