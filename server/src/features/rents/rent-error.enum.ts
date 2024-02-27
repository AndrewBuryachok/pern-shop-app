export enum RentError {
  ALREADY_COMPLETED = '400: Аренду уже завершено',
  NOT_OWNER = '403: Вы не владелец аренды',
  CREATE_FAILED = '500: Не удалось создать аренду',
  CONTINUE_FAILED = '500: Не удалось продолжить аренду',
  COMPLETE_FAILED = '500: Не удалось завершить аренду',
}
