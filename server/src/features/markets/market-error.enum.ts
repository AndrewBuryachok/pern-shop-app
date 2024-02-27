export enum MarketError {
  ALREADY_HAS_ENOUGH = '400: У пользователя уже достаточно рынков',
  NAME_ALREADY_USED = '400: Название рынка уже использовано',
  COORDINATES_ALREADY_USED = '400: Координаты рынка уже использовано',
  NOT_OWNER = '403: Вы не владелец рынка',
  CREATE_FAILED = '500: Не удалось создать рынок',
  EDIT_FAILED = '500: Не удалось редактировать рынок',
}
