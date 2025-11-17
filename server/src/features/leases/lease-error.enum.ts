export enum LeaseError {
  ALREADY_COMPLETED = '400: Оренду вже завершено',
  NOT_OWNER = '403: Ви не власник оренди',
  CREATE_FAILED = '500: Не вдалося створити оренду',
  CONTINUE_FAILED = '500: Не вдалося продовжити оренду',
  COMPLETE_FAILED = '500: Не вдалося завершити оренду',
}
