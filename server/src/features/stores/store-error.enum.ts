export enum StoreError {
  ALREADY_HAS_ENOUGH = '400: У рынка уже достаточно палаток',
  NOT_FREE = '400: Палатка уже занята',
  CREATE_FAILED = '500: Не удалось создать палатку',
  RESERVE_FAILED = '500: Не удалось занять палатку',
  CONTINUE_FAILED = '500: Не удалось продолжить палатку',
  UNRESERVE_FAILED = '500: Не удалось освободить палатку',
}
