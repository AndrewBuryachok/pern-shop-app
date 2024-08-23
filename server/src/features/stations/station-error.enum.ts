export enum StationError {
  NAME_ALREADY_USED = '400: Station name already used',
  COORDINATES_ALREADY_USED = '400: Station coordinates already used',
  NOT_OWNER = '403: You are not station owner',
  CREATE_FAILED = '500: Failed to create station',
  EDIT_FAILED = '500: Failed to edit station',
}
