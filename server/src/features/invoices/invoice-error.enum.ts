export enum InvoiceError {
  ALREADY_COMPLETED = '400: Інвойс вже сплачено',
  NOT_RECEIVER = '403: Ви не отримувач інвойсу',
  CREATE_FAILED = '500: Не вдалося створити інвойс',
  COMPLETE_FAILED = '500: Не вдалося сплатити інвойс',
  DELETE_FAILED = '500: Не вдалося видалити інвойс',
}
