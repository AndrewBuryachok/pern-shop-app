import { ReactNode } from 'react';
import { getActiveNotifications } from '../../features/mqtt/mqtt.slice';
import NotificationBadge from './NotificationBadge';

type Props = {
  pages: string[];
  icon?: ReactNode;
};

export default function NotificationBadgeByPages(props: Props) {
  const notifications = getActiveNotifications().filter((notification) =>
    props.pages.includes(notification.page),
  );

  return notifications.length ? (
    <NotificationBadge count={notifications.length} />
  ) : (
    <>{props.icon}</>
  );
}
