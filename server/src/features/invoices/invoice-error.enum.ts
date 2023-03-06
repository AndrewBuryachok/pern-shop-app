export enum InvoiceError {
  ALREADY_COMPLETED = '400: Invoice already completed',
  NOT_SENDER = '403: You are not invoice sender',
  NOT_RECEIVER = '403: You are not invoice receiver',
  CREATE_FAILED = '500: Failed to create invoice',
  COMPLETE_FAILED = '500: Failed to complete invoice',
  DELETE_FAILED = '500: Failed to delete invoice',
}
