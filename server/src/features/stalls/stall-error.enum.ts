export enum StallError {
  NOT_FREE = '400: Палатка вже зайнята',
  CREATE_FAILED = '500: Не вдалося створити палатку',
  RESERVE_FAILED = '500: Не вдалося зайняти палатку',
  CONTINUE_FAILED = '500: Не вдалося продовжити бронювання палатки',
  UNRESERVE_FAILED = '500: Не вдалося завершити бронювання палатки',
}
