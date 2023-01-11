import {
  MiddlewareAPI,
  Middleware,
  isFulfilled,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';

export const logger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    if (isFulfilled(action) && action.meta.arg.type !== 'query') {
      closeAllModals();
      showNotification({
        title: 'Success',
        message: 'Operation completed successfully',
        color: 'green',
      });
    }
    if (isRejectedWithValue(action)) {
      showNotification({
        title: 'Error',
        message: action.payload.data.message,
        color: 'red',
      });
    }
    return next(action);
  };
