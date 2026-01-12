export enum InvoiceError {
  ALREADY_COMPLETED = '400: Інвойс вже сплачено',
  NOT_SENDER = '403: Ви не відправник інвойсу',
  NOT_RECEIVER = '403: Ви не отримувач інвойсу',
  CREATE_FAILED = '500: Не вдалося створити інвойс',
  EDIT_FAILED = '500: Не вдалося редагувати інвойс',
  COMPLETE_FAILED = '500: Не вдалося сплатити інвойс',
  DELETE_FAILED = '500: Не вдалося видалити інвойс',
}
