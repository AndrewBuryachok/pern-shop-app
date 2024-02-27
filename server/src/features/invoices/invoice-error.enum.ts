export enum InvoiceError {
  ALREADY_COMPLETED = '400: Счет уже завершено',
  NOT_SENDER = '403: Вы не отправитель счета',
  NOT_RECEIVER = '403: Вы не получатель счета',
  CREATE_FAILED = '500: Не удалось создать счет',
  COMPLETE_FAILED = '500: Не удалось завершить счет',
  DELETE_FAILED = '500: Не удалось удалить счет',
}
