import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ActionIcon, Indicator, Menu } from '@mantine/core';
import { hideNotification } from '@mantine/notifications';
import { IconBell, IconPoint } from '@tabler/icons';
import { getActiveNotifications } from '../../features/mqtt/mqtt.slice';
import DoubleText from './DoubleText';
import { parseTime } from '../utils';
import { notificationToTab } from '../enums';

export default function NotificationsMenu() {
  const [t] = useTranslation();

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
        {notifications.map(({ key, nick, action, page, id, date }) => (
          <Menu.Item
            key={key}
            icon={<IconPoint size={16} />}
            component={Link}
            to={
              page === 'chats'
                ? `/${page}/${nick}`
                : `/${page}/${
                    notificationToTab
                      .find(
                        (notification) =>
                          notification.split(' ')[0] === action &&
                          notification.split(' ')[1] === page,
                      )!
                      .split(' ')[2]
                  }?id=${id}`.replace('/main', '')
            }
            onClick={() => hideNotification(key)}
          >
            <DoubleText
              text={nick + ' ' + t(`notifications.${page}.${action}`)}
              subtext={parseTime(new Date(date))}
              bold
              dimmed
            />
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
