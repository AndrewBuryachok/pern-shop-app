import { ReactNode } from 'react';
import { Badge } from '@mantine/core';
import { getActiveNotifications } from '../../features/mqtt/mqtt.slice';

type Props = {
  pages: string[];
  icon?: ReactNode;
};

export default function NotificationBadge(props: Props) {
  const notifications = getActiveNotifications();

  const pages = Object.keys(notifications)
    .map((page) => page.split('/')[3])
    .filter((page) => props.pages.includes(page));

  return pages.length ? (
    <Badge size='xs' variant='filled' color='red' w={16} h={16} p={0}>
      {pages.length}
    </Badge>
  ) : (
    <>{props.icon}</>
  );
}
