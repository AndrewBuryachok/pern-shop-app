import { INotification } from '../interfaces';
import { notifications } from '../enums';

export const notificationToLink = (notification: INotification) =>
  notification.page === 'chats'
    ? `/${notification.page}/${notification.nick}`
    : `/${notification.page}/${
        notifications
          .find((n) =>
            n.startsWith(notification.action + ' ' + notification.page),
          )!
          .split(' ')[2]
      }?id=${notification.id}`.replace('/main', '');
