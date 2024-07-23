export enum DrawerError {
  ALREADY_HAS_ENOUGH = '400: Station already has enough drawers',
  NO_FREE = '404: No free drawers',
  CREATE_FAILED = '500: Failed to create drawer',
  RESERVE_FAILED = '500: Failed to reserve drawer',
  CONTINUE_FAILED = '500: Failed to continue drawer',
  UNRESERVE_FAILED = '500: Failed to unreserve drawer',
}
