export enum StorageError {
  NAME_ALREADY_USED = '400: Назва складу вже використовується',
  COORDINATES_ALREADY_USED = '400: Координати складу вже використовується',
  NOT_OWNER = '403: Ви не власник складу',
  CREATE_FAILED = '500: Не вдалося створити склад',
  EDIT_FAILED = '500: Не вдалося редагувати склад',
}
