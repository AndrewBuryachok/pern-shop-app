export enum BoxError {
  NO_FREE = '404: Немає вільних ящиків',
  CREATE_FAILED = '500: Не вдалося створити ящик',
  RESERVE_FAILED = '500: Не вдалося зайняти ящик',
  CONTINUE_FAILED = '500: Не вдалося продовжити бронювання ящика',
  UNRESERVE_FAILED = '500: Не вдалося завершити бронювання ящика',
}
