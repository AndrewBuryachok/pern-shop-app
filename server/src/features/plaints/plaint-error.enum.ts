export enum PlaintError {
  ALREADY_COMPLETED = '400: Жалобу уже завершено',
  NOT_SENDER = '403: Вы не отправитель жалобы',
  CREATE_FAILED = '500: Не удалось создать жалобу',
  EDIT_FAILED = '500: Не удалось редактировать жалобу',
  COMPLETE_FAILED = '500: Не удалось завершить жалобу',
  DELETE_FAILED = '500: Не удалось удалить жалобу',
}
