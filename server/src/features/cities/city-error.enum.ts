export enum CityError {
  ALREADY_HAS_ENOUGH = '400: User already has enough cities',
  NAME_ALREADY_USED = '400: City name already used',
  COORDINATES_ALREADY_USED = '400: City coordinates already used',
  NOT_OWNER = '403: You are not city owner',
  CREATE_FAILED = '500: Failed to create city',
  EDIT_FAILED = '500: Failed to edit city',
}
