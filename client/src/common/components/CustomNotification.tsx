import { showNotification } from '@mantine/notifications';
import NotificationAvatar from './NotificationAvatar';

type Props = {
  id: string;
  title: string;
  message: string;
};

export const showNotificationWithAvatar = (props: Props) =>
  showNotification({
    ...props,
    icon: <NotificationAvatar nick={props.title} />,
  });
