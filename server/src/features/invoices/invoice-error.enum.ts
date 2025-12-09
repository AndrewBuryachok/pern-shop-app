export enum InvoiceError {
  ALREADY_COMPLETED = '400: Штраф вже завершено',
  NOT_RECEIVER = '403: Ви не отримувач штрафу',
  CREATE_FAILED = '500: Не вдалося створити штраф',
  COMPLETE_FAILED = '500: Не вдалося завершити штраф',
  DELETE_FAILED = '500: Не вдалося видалити штраф',
}
