export enum LeaseError {
  ALREADY_COMPLETED = '400: Прокат вже завершено',
  NOT_OWNER = '403: Ви не власник прокату',
  CREATE_FAILED = '500: Не вдалося створити прокат',
  CONTINUE_FAILED = '500: Не вдалося продовжити прокат',
  COMPLETE_FAILED = '500: Не вдалося завершити прокат',
}
