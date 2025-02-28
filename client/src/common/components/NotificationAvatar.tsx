import { Skeleton, ThemeIcon } from '@mantine/core';
import { IconBell } from '@tabler/icons';
import { useSelectAllUsersQuery } from '../../features/users/users.api';
import LinkedAvatar from './LinkedAvatar';

type Props = { nick: string };

export default function NotificationAvatar(props: Props) {
  if (props.nick === '🔔') {
    return (
      <ThemeIcon size={32}>
        <IconBell size={24} />
      </ThemeIcon>
    );
  }

  const { data: users } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.nick === props.nick);

  return user ? <LinkedAvatar {...user} /> : <Skeleton w={32} h={32} />;
}
