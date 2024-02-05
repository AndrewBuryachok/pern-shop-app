import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ActionIcon, Indicator, Menu } from '@mantine/core';
import { IconBell, IconPoint } from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getActiveNotifications,
  publishNotification,
  removeNotification,
} from '../../features/mqtt/mqtt.slice';
import { parseTime } from '../utils';
import { notificationToTab } from '../enums';

export default function NotificationsMenu() {
  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const notifications = [...getActiveNotifications()].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <Menu offset={4} position='bottom-end' trigger='hover'>
      <Menu.Target>
        <Indicator
          label={notifications.length}
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
        {notifications.map(({ key, userId, nick, action, page, id, date }) => (
          <Menu.Item
            key={key}
            icon={<IconPoint size={16} />}
            component={Link}
            to={`/${page}/${
              notificationToTab
                .find(
                  (notification) =>
                    notification.split(' ')[0] === action &&
                    notification.split(' ')[1] === page,
                )!
                .split(' ')[2]
            }?id=${id}`.replace('/main', '')}
            onClick={() =>
              +userId
                ? dispatch(publishNotification(key))
                : dispatch(removeNotification(key))
            }
          >
            {nick} {t(`notifications.${page}.${action}`)}
            <br />
            {parseTime(new Date(date))}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
