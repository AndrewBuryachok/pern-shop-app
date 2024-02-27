export enum StorageError {
  ALREADY_HAS_ENOUGH = '400: У пользователя уже достаточно складов',
  NAME_ALREADY_USED = '400: Название склада уже использовано',
  COORDINATES_ALREADY_USED = '400: Координаты склада уже использовано',
  NOT_OWNER = '403: Вы не владелец склада',
  CREATE_FAILED = '500: Не удалось создать склад',
  EDIT_FAILED = '500: Не удалось редактировать склад',
}
