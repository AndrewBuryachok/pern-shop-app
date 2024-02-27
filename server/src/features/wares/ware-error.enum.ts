export enum WareError {
  ALREADY_EXPIRED = '400: Изделие уже просрочено',
  ALREADY_COMPLETED = '400: Изделие уже завершено',
  NOT_ENOUGH_AMOUNT = '400: У изделия недостаточно слотов',
  NOT_OWNER = '403: Вы не владелец издения',
  CREATE_FAILED = '500: Не удалось создать изделие',
  EDIT_FAILED = '500: Не удалось редактировать изделие',
  COMPLETE_FAILED = '500: Не удалось завершить изделие',
  BUY_FAILED = '500: Не удалось купить изделие',
}
