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
    if (isFulfilled(action) && action.meta.arg.type !== 'query') {
      closeAllModals();
      showNotification({
        title: t('notifications.success'),
        message: t('notifications.message'),
        color: 'green',
      });
    }
    if (isRejectedWithValue(action)) {
      showNotification({
        title: t('notifications.error'),
        message: action.payload.data.message,
        color: 'red',
      });
    }
    return next(action);
  };
