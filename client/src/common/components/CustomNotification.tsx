import { showNotification } from '@mantine/notifications';
import { SmUser } from '../../features/users/user.model';
import NotificationAvatar from './NotificationAvatar';

type Props = {
  id: string;
  title: string;
  message: string;
  user?: SmUser;
};

export const showNotificationWithAvatar = (props: Props) =>
  showNotification({
    ...props,
    icon: <NotificationAvatar user={props.user} />,
  });
