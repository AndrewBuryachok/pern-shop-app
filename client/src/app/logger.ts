import { t } from 'i18next';
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
    if (
      isFulfilled(action) &&
      action.meta.arg.type !== 'query' &&
      !action.meta.arg.endpointName.includes('view')
    ) {
      closeAllModals();
      showNotification({
        title: t('notifications.system'),
        message: t('notifications.message'),
        color: 'green',
      });
    }
    if (isRejectedWithValue(action)) {
      showNotification({
        title: t('notifications.system'),
        message: action.payload.data.message,
        color: 'red',
      });
    }
    return next(action);
  };
