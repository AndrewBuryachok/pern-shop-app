export enum TransactionError {
  INCREASE_FAILED = '500: Не вдалося створити транзакцію-збільшення',
  DECREASE_FAILED = '500: Не вдалося створити транзакцію-зменшення',
  TRANSFER_FAILED = '500: Не вдалося переказати діаманти',
  DELETE_FAILED = '500: Не вдалося видалити транзакцію',
}
