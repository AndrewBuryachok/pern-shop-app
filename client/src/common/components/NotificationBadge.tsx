import { Badge } from '@mantine/core';

type Props = {
  count: number;
};

export default function NotificationBadge(props: Props) {
  return (
    <Badge size='sm' variant='filled' color='red' w={16} h={16} p={0}>
      {props.count}
    </Badge>
  );
}
