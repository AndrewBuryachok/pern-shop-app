export enum StorageError {
  NAME_ALREADY_USED = '400: Storage name already used',
  COORDINATES_ALREADY_USED = '400: Storage coordinates already used',
  NOT_OWNER = '403: You are not storage owner',
  CREATE_FAILED = '500: Failed to create storage',
  EDIT_FAILED = '500: Failed to edit storage',
}
