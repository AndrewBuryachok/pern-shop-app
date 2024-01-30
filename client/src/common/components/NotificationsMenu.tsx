import { useTranslation } from 'react-i18next';
import { ActionIcon, Indicator, Menu } from '@mantine/core';
import { IconBell, IconPoint } from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getActiveNotifications,
  publishNotification,
  removeNotification,
} from '../../features/mqtt/mqtt.slice';
import { parseTime } from '../utils';

export default function NotificationsMenu() {
  const [t] = useTranslation();

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
        {keys
          .map((notification) => [notification].concat(notification.split('/')))
          .map(([notification, id, nick, action, page]) => (
            <Menu.Item
              key={notification}
              icon={<IconPoint size={16} />}
              onClick={() =>
                +id
                  ? dispatch(publishNotification(notification))
                  : dispatch(removeNotification(notification))
              }
            >
              {nick + ' ' + t(`notifications.${page}.${action}`)}
              <br />
              {parseTime(new Date(notifications[notification]))}
            </Menu.Item>
          ))}
      </Menu.Dropdown>
    </Menu>
  );
}
