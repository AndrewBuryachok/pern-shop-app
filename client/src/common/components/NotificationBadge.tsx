import { ReactNode } from 'react';
import { Badge } from '@mantine/core';
import { getActiveNotifications } from '../../features/mqtt/mqtt.slice';

type Props = {
  pages: string[];
  icon?: ReactNode;
};

export default function NotificationBadge(props: Props) {
  const notifications = getActiveNotifications().filter(({ page }) =>
    props.pages.includes(page),
  );

  return notifications.length ? (
    <Badge size='xs' variant='filled' color='red' w={16} h={16} p={0}>
      {notifications.length}
    </Badge>
  ) : (
    <>{props.icon}</>
  );
}
