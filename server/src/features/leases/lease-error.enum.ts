export enum LeaseError {
  ALREADY_COMPLETED = '400: Прокат уже завершено',
  NOT_OWNER = '403: Вы не владелец проката',
  CREATE_FAILED = '500: Не удалось создать прокат',
  CONTINUE_FAILED = '500: Не удалось продолжить прокат',
  COMPLETE_FAILED = '500: Не удалось завершить прокат',
}
