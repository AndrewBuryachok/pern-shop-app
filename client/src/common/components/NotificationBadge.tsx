import { ReactNode } from 'react';
import { Badge } from '@mantine/core';
import { getActiveNotifications } from '../../features/mqtt/mqtt.slice';

type Props = {
  pages: string[];
  icon?: ReactNode;
};

export default function NotificationBadge(props: Props) {
  const notifications = getActiveNotifications();

  const keys = Object.keys(notifications).filter((key) => notifications[key]);

  return keys.find((key) => props.pages.includes(key)) ? (
    <Badge size='xs' variant='filled' color='red' w={16} h={16} p={0}>
      {keys
        .filter((key) => props.pages.includes(key))
        .reduce((acc, cur) => acc + notifications[cur], 0)}
    </Badge>
  ) : (
    <>{props.icon}</>
  );
}
