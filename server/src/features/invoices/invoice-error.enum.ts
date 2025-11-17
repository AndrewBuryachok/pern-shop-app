export enum InvoiceError {
  ALREADY_COMPLETED = '400: Накладну вже завершено',
  NOT_SENDER = '403: Ви не відправник накладної',
  NOT_RECEIVER = '403: Ви не отримувач накладної',
  CREATE_FAILED = '500: Не вдалося створити накладну',
  COMPLETE_FAILED = '500: Не вдалося завершити накладну',
  DELETE_FAILED = '500: Не вдалося видалити накладну',
}
