import { useTranslation } from 'react-i18next';
import { ActionIcon, Indicator, Menu } from '@mantine/core';
import { IconBell, IconPoint } from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import { getCurrentUser } from '../../features/auth/auth.slice';
import {
  getActiveNotifications,
  publishNotification,
} from '../../features/mqtt/mqtt.slice';
import { parseTime } from '../utils';

export default function NotificationsMenu() {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const notifications = getActiveNotifications();

  const keys = Object.keys(notifications);

  const dispatch = useAppDispatch();

  return (
    <Menu offset={4} position='bottom-end' trigger='hover'>
      <Menu.Target>
        <Indicator
          label={keys.length}
          overflowCount={9}
          showZero={false}
          dot={false}
          size={16}
          color='red'
        >
          <ActionIcon size={32} variant='filled' color='violet'>
            <IconBell size={24} />
          </ActionIcon>
        </Indicator>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t('header.menu.notifications.title')}</Menu.Label>
        {keys.map((notification) => (
          <Menu.Item
            key={notification}
            icon={<IconPoint size={16} />}
            onClick={() =>
              dispatch(publishNotification(`${user?.id}/${notification}`))
            }
          >
            {t(
              `notifications.${notification.split('/')[0]}.${
                notification.split('/')[2]
              }`,
            )}
            <br />
            {parseTime(new Date(notifications[notification]))}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
