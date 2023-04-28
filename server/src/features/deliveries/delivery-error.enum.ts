export enum DeliveryError {
  ALREADY_EXPIRED = '400: Delivery already expired',
  ALREADY_TAKEN = '400: Delivery already taken',
  NOT_TAKEN = '400: Delivery is not taken',
  ALREADY_EXECUTED = '400: Delivery already executed',
  NOT_EXECUTED = '400: Delivery is not executed',
  ALREADY_COMPLETED = '400: Delivery already completed',
  NOT_SENDER = '403: You are not delivery sender',
  NOT_RECEIVER = '403: You are not delivery receiver',
  NOT_EXECUTOR = '403: You are not delivery executor',
  CREATE_FAILED = '500: Failed to create delivery',
  TAKE_FAILED = '500: Failed to take delivery',
  UNTAKE_FAILED = '500: Failed to untake delivery',
  EXECUTE_FAILED = '500: Failed to execute delivery',
  COMPLETE_FAILED = '500: Failed to complete delivery',
  DELETE_FAILED = '500: Failed to delete delivery',
}
