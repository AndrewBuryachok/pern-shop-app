export enum HireError {
  ALREADY_COMPLETED = '400: Найм вже завершено',
  NOT_OWNER = '403: Ви не власник найму',
  CREATE_FAILED = '500: Не вдалося створити найм',
  CONTINUE_FAILED = '500: Не вдалося продовжити найм',
  COMPLETE_FAILED = '500: Не вдалося завершити найм',
}
