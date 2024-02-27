export enum LotError {
  ALREADY_EXPIRED = '400: Лот уже просрочено',
  ALREADY_COMPLETED = '400: Лот уже завершено',
  NOT_ENOUGH_PRICE = '400: У лота недостаточная цена',
  NOT_OWNER = '403: Вы не владелец лота',
  CREATE_FAILED = '500: Не удалось создать лот',
  BUY_FAILED = '500: Не удалось купить лот',
  COMPLETE_FAILED = '500: Не удалось редактировать лот',
}
