export enum CellError {
  ALREADY_HAS_ENOUGH = '400: У склада уже достаточно ячеек',
  NO_FREE = '404: Нет свободных ячеек',
  CREATE_FAILED = '500: Не удалось создать ячейку',
  RESERVE_FAILED = '500: Не удалось занять ячейку',
  CONTINUE_FAILED = '500: Не удалось продолжить ячейку',
  UNRESERVE_FAILED = '500: Не удалось освободить ячейку',
}
