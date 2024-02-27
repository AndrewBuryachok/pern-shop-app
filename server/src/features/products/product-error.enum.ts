export enum ProductError {
  ALREADY_EXPIRED = '400: Продукт уже просрочено',
  ALREADY_COMPLETED = '400: Продукт уже завершено',
  NOT_ENOUGH_AMOUNT = '400: У продукта недостаточно слотов',
  NOT_OWNER = '403: Вы не владелец продукта',
  CREATE_FAILED = '500: Не удалось создать продукт',
  EDIT_FAILED = '500: Не удалось редактировать продукт',
  COMPLETE_FAILED = '500: Не удалось завершить продукт',
  BUY_FAILED = '500: Не удалось купить продукт',
}
