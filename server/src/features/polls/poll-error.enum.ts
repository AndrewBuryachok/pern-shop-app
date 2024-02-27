export enum PollError {
  ALREADY_COMPLETED = '400: Идею уже завершено',
  ALREADY_VIEWED = '400: Вы уже посмотрели идею',
  NOT_OWNER = '403: Вы не владелец идеи',
  CREATE_FAILED = '500: Не удалось создать идею',
  EDIT_FAILED = '500: Не удалось редактировать идею',
  COMPLETE_FAILED = '500: Не удалось завершить идею',
  DELETE_FAILED = '500: Не удалось удалить идею',
  ADD_VIEW_FAILED = '500: Не удалось добавить просмотр',
  ADD_VOTE_FAILED = '500: Не удалось добавить реакцию',
  UPDATE_VOTE_FAILED = '500: Не удалось изменить реакцию',
  REMOVE_VOTE_FAILED = '500: Не удалось убрать реакцию',
}
