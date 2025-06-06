import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavLink, ScrollArea } from '@mantine/core';
import {
  IconArticle,
  IconBasket,
  IconBuildingCircus,
  IconBuildingCottage,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconChartBar,
  IconChecklist,
  IconHome,
  IconMailbox,
  IconMap,
  IconMessages,
  IconNews,
  IconUsers,
  IconWallet,
} from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getActiveNotifications,
  publishNotificationWithUser,
} from '../../features/mqtt/mqtt.slice';
import NotificationBadgeByPages from './NotificationBadgeByPages';

type Props = {
  opened: boolean;
};

export default function CustomNavbar(props: Props) {
  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const notifications = getActiveNotifications();

  const links = [
    {
      label: 'home',
      icon: IconHome,
    },
    {
      label: 'reports',
      icon: IconNews,
    },
    {
      label: 'articles',
      icon: IconArticle,
    },
    {
      label: 'polls',
      icon: IconChartBar,
    },
    {
      label: 'chats',
      icon: IconMessages,
      sub: '/my',
    },
    {
      label: 'wallet',
      icon: IconWallet,
      nested: [
        { label: 'cards', sub: '/my' },
        { label: 'payments', sub: '/my' },
        { label: 'exchanges', sub: '/my' },
        { label: 'invoices', sub: '/my' },
      ],
    },
    {
      label: 'trading',
      icon: IconBasket,
      nested: [
        { label: 'goods' },
        { label: 'purchases', sub: '/my' },
        { label: 'deliveries' },
      ],
    },
    {
      label: 'shops',
      icon: IconBuildingStore,
    },
    {
      label: 'markets',
      icon: IconBuildingCircus,
      nested: [
        { label: 'rents' },
        { label: 'stalls' },
        { label: 'markets-tags' },
        { label: 'markets' },
      ],
    },
    {
      label: 'storages',
      icon: IconBuildingWarehouse,
      nested: [
        { label: 'leases' },
        { label: 'cells' },
        { label: 'storages-tags' },
        { label: 'storages' },
      ],
    },
    {
      label: 'mail',
      icon: IconMailbox,
      nested: [
        { label: 'orders' },
        { label: 'haulages' },
        { label: 'hires' },
        { label: 'boxes' },
        { label: 'stations' },
      ],
    },
    {
      label: 'services',
      icon: IconChecklist,
      nested: [{ label: 'tasks' }, { label: 'adverts' }],
    },
    {
      label: 'map',
      icon: IconMap,
    },
    {
      label: 'farms',
      icon: IconBuildingCottage,
    },
    {
      label: 'towns',
      icon: IconBuildingSkyscraper,
      nested: [
        { label: 'towns' },
        { label: 'residents', sub: '/my' },
        { label: 'invitations', sub: '/sent' },
        { label: 'applications', sub: '/sent' },
      ],
    },
    {
      label: 'users',
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
                  key={link.label}
                  label={t(`navbar.${link.label}`)}
                  icon={
                    <NotificationBadgeByPages
                      pages={link.nested.map((sublink) => sublink.label)}
                      icon={<link.icon size={16} />}
                    />
                  }
                  active={
                    !!link.nested.find((sublink) => sublink.label === active)
                  }
                  childrenOffset={28}
                >
                  {link.nested.map((sublink) => (
                    <NavLink
                      key={sublink.label}
                      label={t(`navbar.${sublink.label}`)}
                      icon={
                        <NotificationBadgeByPages pages={[sublink.label]} />
                      }
                      component={Link}
                      to={`/${sublink.label}${sublink.sub || ''}`}
                      active={sublink.label === active}
                      onClick={() =>
                        notifications
                          .filter(
                            (notification) =>
                              notification.page === sublink.label,
                          )
                          .forEach((notification) =>
                            dispatch(
                              publishNotificationWithUser(notification.key),
                            ),
                          )
                      }
                    />
                  ))}
                </NavLink>
              ) : (
                <NavLink
                  key={link.label}
                  label={t(`navbar.${link.label}`)}
                  icon={
                    <NotificationBadgeByPages
                      pages={[link.label]}
                      icon={<link.icon size={16} />}
                    />
                  }
                  component={Link}
                  to={`/${link.label === 'home' ? '' : link.label}${
                    link.sub || ''
                  }`}
                  active={link.label === active}
                  onClick={() =>
                    notifications
                      .filter(
                        (notification) => notification.page === link.label,
                      )
                      .forEach((notification) =>
                        dispatch(publishNotificationWithUser(notification.key)),
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
