import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavLink, ScrollArea } from '@mantine/core';
import { hideNotification } from '@mantine/notifications';
import {
  IconArticle,
  IconBasket,
  IconBoxSeam,
  IconBuildingCommunity,
  IconChartBar,
  IconChecklist,
  IconContainer,
  IconFriends,
  IconHome,
  IconMail,
  IconMailOff,
  IconMap,
  IconNews,
  IconReceipt,
  IconScale,
  IconStar,
  IconTags,
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
      route: 'users',
      icon: IconUsers,
    },
    {
      route: 'friends',
      icon: IconFriends,
      sub: '/top',
    },
    {
      route: 'subscribers',
      icon: IconMail,
      sub: '/top',
    },
    {
      route: 'ignorers',
      icon: IconMailOff,
      sub: '/top',
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
      route: 'wallet',
      icon: IconWallet,
      nested: ['cards', 'payments', 'exchanges', 'invoices'],
      sub: '/my',
    },
    {
      route: 'things',
      icon: IconBasket,
      nested: ['goods', 'wares', 'products', 'lots'],
    },
    {
      route: 'purchases',
      icon: IconTags,
      nested: ['trades', 'sales', 'bids'],
      sub: '/my',
    },
    {
      route: 'transportations',
      icon: IconBoxSeam,
      nested: ['orders', 'deliveries'],
    },
    {
      route: 'map',
      icon: IconMap,
    },
    {
      route: 'places',
      icon: IconBuildingCommunity,
      nested: ['cities', 'shops', 'markets', 'storages'],
    },
    {
      route: 'containers',
      icon: IconContainer,
      nested: ['stores', 'cells'],
    },
    {
      route: 'receipts',
      icon: IconReceipt,
      nested: ['rents', 'leases'],
    },
    {
      route: 'tasks',
      icon: IconChecklist,
    },
    {
      route: 'plaints',
      icon: IconScale,
    },
    {
      route: 'polls',
      icon: IconChartBar,
    },
    {
      route: 'ratings',
      icon: IconStar,
      sub: '/top',
    },
  ];

  const active = useLocation().pathname.split('/')[1] || 'home';

  return (
    <Navbar
      p='md'
      hiddenBreakpoint='sm'
      hidden={!props.opened}
      width={{ sm: 200, lg: 300 }}
      withBorder={!props.opened}
    >
      <Navbar.Section component={ScrollArea} grow>
        {links.map((link) =>
          link.nested ? (
            <NavLink
              key={link.route}
              label={t(`navbar.${link.route}`)}
              icon={
                <NotificationBadge
                  pages={link.nested}
                  icon={<link.icon size={16} />}
                />
              }
              active={link.nested.includes(active)}
              childrenOffset={28}
            >
              {link.nested.map((route) => (
                <NavLink
                  key={route}
                  label={t(`navbar.${route}`)}
                  icon={<NotificationBadge pages={[route]} />}
                  component={Link}
                  to={`${route}${link.sub || ''}`}
                  active={route === active}
                  onClick={() =>
                    notifications
                      .filter((notification) => notification.page === route)
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
                  .filter((notification) => notification.page === link.route)
                  .forEach((notification) => hideNotification(notification.key))
              }
            />
          ),
        )}
      </Navbar.Section>
    </Navbar>
  );
}
