export enum InvoiceError {
  ALREADY_COMPLETED = '400: Інвойс вже завершено',
  NOT_RECEIVER = '403: Ви не отримувач інвойсу',
  CREATE_FAILED = '500: Не вдалося створити інвойс',
  COMPLETE_FAILED = '500: Не вдалося завершити інвойс',
  DELETE_FAILED = '500: Не вдалося видалити інвойс',
}
