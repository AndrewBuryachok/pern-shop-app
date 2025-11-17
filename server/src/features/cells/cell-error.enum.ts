export enum CellError {
  NOT_FREE = '400: Комірка вже зайнята',
  CREATE_FAILED = '500: Не вдалося створити комірку',
  RESERVE_FAILED = '500: Не вдалося зайняти комірку',
  CONTINUE_FAILED = '500: Не вдалося продовжити бронювання комірки',
  UNRESERVE_FAILED = '500: Не вдалося завершити бронювання комірки',
}
