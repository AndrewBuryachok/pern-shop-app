import { Skeleton } from '@mantine/core';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import LinkedAvatar from './LinkedAvatar';

type Props = { nick: string };

export default function NotificationAvatar(props: Props) {
  const { data: users } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.nick === props.nick);

  return user ? <LinkedAvatar {...user} /> : <Skeleton w={32} h={32} />;
}
