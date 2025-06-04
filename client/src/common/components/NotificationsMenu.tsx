import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  Group,
  Indicator,
  ScrollArea,
  Stack,
  Tabs,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBell } from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getActiveNotifications,
  publishNotificationWithUser,
} from '../../features/mqtt/mqtt.slice';
import NotificationBadge from './NotificationBadge';
import NotificationAvatar from './NotificationAvatar';
import SingleText from './SingleText';
import { INotification } from '../interfaces';
import { notificationToLink, parseDate } from '../utils';

export default function NotificationsMenu() {
  const [t] = useTranslation();

  const [opened, { open, close }] = useDisclosure(false);

  const tabs = ['main', 'my'] as const;

  const [tab, setTab] = useState<(typeof tabs)[number]>(tabs[0]);

  const dispatch = useAppDispatch();

  const notifications = [...getActiveNotifications()].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  const notificationsByTabs = {
    main: notifications.filter((notification) => !notification.toUserId),
    my: notifications.filter((notification) => notification.toUserId),
  };

  const notificationsByDates = tabs.map((tab) =>
    notificationsByTabs[tab].reduce((acc, cur) => {
      const date = parseDate(cur.date).date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(cur);
      return acc;
    }, {} as { [key: string]: INotification[] }),
  );

  return (
    <>
      <Indicator
        label={notifications.length}
        overflowCount={9}
        showZero={false}
        dot={false}
        size={16}
        color='red'
      >
        <ActionIcon size={32} variant='filled' color='violet' onClick={open}>
          <IconBell size={24} />
        </ActionIcon>
      </Indicator>
      <Drawer
        opened={opened}
        onClose={close}
        title={t('header.menu.notifications.title')}
        position='right'
        padding='md'
        size='lg'
      >
        <Tabs
          value={tab}
          onTabChange={(tab) => setTab(tab as (typeof tabs)[number])}
        >
          <Tabs.List grow>
            {tabs.map((tab) => (
              <Tabs.Tab
                key={tab}
                value={tab}
                rightSection={
                  !!notificationsByTabs[tab].length && (
                    <NotificationBadge
                      count={notificationsByTabs[tab].length}
                    />
                  )
                }
              >
                {t(`pages.${tab}`)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {tabs.map((tab, index) => (
            <Tabs.Panel key={tab} value={tab}>
              <ScrollArea style={{ height: 'calc(100vh - 112px)' }}>
                <Stack spacing={8}>
                  {!notificationsByTabs[tab].length && (
                    <Divider
                      size={0}
                      label={t('header.menu.notifications.empty')}
                      labelPosition='center'
                    />
                  )}
                  {!!notificationsByTabs[tab].length && (
                    <Button
                      variant='subtle'
                      color='red'
                      onClick={() =>
                        notificationsByTabs[tab].forEach((notification) =>
                          dispatch(
                            publishNotificationWithUser(notification.key),
                          ),
                        )
                      }
                      fullWidth
                      compact
                    >
                      {t('header.menu.notifications.read')}
                    </Button>
                  )}
                  {Object.entries(notificationsByDates[index]).map(
                    ([date, notifications]) => (
                      <Fragment key={date}>
                        <Divider label={date} labelPosition='center' />
                        {notifications.map((notification) => (
                          <Fragment key={notification.key}>
                            <Group spacing={8}>
                              <NotificationAvatar user={notification.user} />
                              <div>
                                <Group spacing={8}>
                                  <SingleText
                                    text={
                                      notification.user?.nick ||
                                      t('notifications.title')
                                    }
                                    bold
                                  />
                                  <SingleText
                                    text={parseDate(notification.date).time}
                                    dimmed
                                  />
                                </Group>
                                <SingleText
                                  text={t(
                                    `notifications.${notification.page}.${notification.action}`,
                                  )}
                                />
                              </div>
                            </Group>
                            <Button.Group>
                              <Button
                                variant='subtle'
                                color='blue'
                                component={Link}
                                to={notificationToLink(notification)}
                                onClick={close}
                                fullWidth
                                compact
                              >
                                {t('actions.view')}
                              </Button>
                              <Button
                                variant='subtle'
                                color='red'
                                onClick={() =>
                                  dispatch(
                                    publishNotificationWithUser(
                                      notification.key,
                                    ),
                                  )
                                }
                                fullWidth
                                compact
                              >
                                {t('actions.delete')}
                              </Button>
                            </Button.Group>
                          </Fragment>
                        ))}
                      </Fragment>
                    ),
                  )}
                </Stack>
              </ScrollArea>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Drawer>
    </>
  );
}
