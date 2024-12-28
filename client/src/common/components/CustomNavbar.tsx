import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavLink, ScrollArea } from '@mantine/core';
import { hideNotification } from '@mantine/notifications';
import {
  IconArticle,
  IconBuildingCottage,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconChartBar,
  IconChecklist,
  IconHome,
  IconMailbox,
  IconMap,
  IconMessages,
  IconNews,
  IconStar,
  IconUsers,
  IconWallet,
} from '@tabler/icons';
import { getActiveNotifications } from '../../features/mqtt/mqtt.slice';
import NotificationBadge from './NotificationBadge';

type Props = {
  opened: boolean;
};

export default function CustomNavbar(props: Props) {
  const [t] = useTranslation();

  const notifications = getActiveNotifications();

  const links = [
    {
      route: 'home',
      icon: IconHome,
    },
    {
      route: 'reports',
      icon: IconNews,
    },
    {
      route: 'articles',
      icon: IconArticle,
    },
    {
      route: 'polls',
      icon: IconChartBar,
    },
    {
      route: 'chats',
      icon: IconMessages,
      sub: '/my',
    },
    {
      route: 'wallet',
      icon: IconWallet,
      nested: ['cards/my', 'payments/my', 'exchanges/my', 'invoices/my'],
    },
    {
      route: 'trading',
      icon: IconBuildingStore,
      nested: [
        'goods',
        'purchases/my',
        'deliveries',
        'stalls',
        'rents',
        'cells',
        'leases',
        'shops',
        'markets',
        'markets-tags',
        'storages',
        'storages-tags',
      ],
    },
    {
      route: 'mail',
      icon: IconMailbox,
      nested: ['orders', 'haulages', 'hires', 'boxes', 'stations'],
    },
    {
      route: 'services',
      icon: IconChecklist,
      nested: ['tasks', 'adverts'],
    },
    {
      route: 'map',
      icon: IconMap,
    },
    {
      route: 'farms',
      icon: IconBuildingCottage,
    },
    {
      route: 'towns',
      icon: IconBuildingSkyscraper,
      nested: [
        'towns',
        'residents/my',
        'invitations/sent',
        'applications/sent',
      ],
    },
    {
      route: 'ratings',
      icon: IconStar,
      sub: '/top',
    },
    {
      route: 'users',
      icon: IconUsers,
    },
  ];

  const active = useLocation().pathname.split('/')[1] || 'home';

  return (
    <>
      {props.opened && (
        <Navbar
          p='md'
          hiddenBreakpoint='sm'
          hidden={!props.opened}
          width={{ sm: 200 }}
          withBorder={false}
        >
          <Navbar.Section component={ScrollArea} grow>
            {links.map((link) =>
              link.nested ? (
                <NavLink
                  key={link.route}
                  label={t(`navbar.${link.route}`)}
                  icon={
                    <NotificationBadge
                      pages={link.nested.map((route) => route.split('/')[0])}
                      icon={<link.icon size={16} />}
                    />
                  }
                  active={link.nested
                    .map((route) => route.split('/')[0])
                    .includes(active)}
                  childrenOffset={28}
                >
                  {link.nested.map((route) => (
                    <NavLink
                      key={route}
                      label={t(`navbar.${route.split('/')[0]}`)}
                      icon={<NotificationBadge pages={[route.split('/')[0]]} />}
                      component={Link}
                      to={route}
                      active={route.split('/')[0] === active}
                      onClick={() =>
                        notifications
                          .filter(
                            (notification) =>
                              notification.page === route.split('/')[0],
                          )
                          .forEach((notification) =>
                            hideNotification(notification.key),
                          )
                      }
                    />
                  ))}
                </NavLink>
              ) : (
                <NavLink
                  key={link.route}
                  label={t(`navbar.${link.route}`)}
                  icon={
                    <NotificationBadge
                      pages={[link.route]}
                      icon={<link.icon size={16} />}
                    />
                  }
                  component={Link}
                  to={`/${link.route === 'home' ? '' : link.route}${
                    link.sub || ''
                  }`}
                  active={link.route === active}
                  onClick={() =>
                    notifications
                      .filter(
                        (notification) => notification.page === link.route,
                      )
                      .forEach((notification) =>
                        hideNotification(notification.key),
                      )
                  }
                />
              ),
            )}
          </Navbar.Section>
        </Navbar>
      )}
    </>
  );
}
