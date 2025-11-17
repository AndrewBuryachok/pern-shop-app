export enum MarketError {
  NAME_ALREADY_USED = '400: Назва ринку вже використовується',
  COORDINATES_ALREADY_USED = '400: Координати ринку вже використовується',
  NOT_OWNER = '403: Ви не власник ринку',
  CREATE_FAILED = '500: Не вдалося створити ринок',
  EDIT_FAILED = '500: Не вдалося редагувати ринок',
}
