export enum StationError {
  NAME_ALREADY_USED = '400: Назва поштомату вже використовується',
  COORDINATES_ALREADY_USED = '400: Координати поштомату вже використовується',
  NOT_OWNER = '403: Ви не власник поштомату',
  CREATE_FAILED = '500: Не вдалося створити поштомат',
  EDIT_FAILED = '500: Не вдалося редагувати поштомат',
}
