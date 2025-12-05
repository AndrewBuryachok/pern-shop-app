export enum ShopError {
  NAME_ALREADY_USED = '400: Назва магазину вже використовується',
  COORDINATES_ALREADY_USED = '400: Координати магазину вже використовується',
  ALREADY_COMPLETED = '400: Магазин вже завершено',
  NOT_OWNER = '403: Ви не власник магазину',
  CREATE_FAILED = '500: Не вдалося створити магазин',
  EDIT_FAILED = '500: Не вдалося редагувати магазин',
  COMPLETE_FAILED = '500: Не вдалося завершити магазин',
}
