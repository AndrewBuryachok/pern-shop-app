import { ThemeIcon } from '@mantine/core';
import { IconBell } from '@tabler/icons';
import { SmUser } from '../../features/users/user.model';
import LinkedAvatar from './LinkedAvatar';

type Props = { user?: SmUser };

export default function NotificationAvatar(props: Props) {
  if (!props.user) {
    return (
      <ThemeIcon size={32}>
        <IconBell size={24} />
      </ThemeIcon>
    );
  }

  return <LinkedAvatar {...props.user} />;
}
