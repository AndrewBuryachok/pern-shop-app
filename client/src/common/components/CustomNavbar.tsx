import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavLink, ScrollArea } from '@mantine/core';
import {
  IconArticle,
  IconBasket,
  IconBuildingSkyscraper,
  IconMailbox,
  IconMap,
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
  isMobile: boolean;
  close: () => void;
};

export default function CustomNavbar(props: Props) {
  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const notifications = getActiveNotifications();

  const links = [
    {
      label: 'articles',
      icon: IconArticle,
    },
    {
      label: 'wallet',
      icon: IconWallet,
      nested: [
        { label: 'cards', sub: '/my' },
        { label: 'transactions', sub: '/my' },
        { label: 'invoices', sub: '/my' },
      ],
    },
    {
      label: 'trading',
      icon: IconBasket,
      nested: [
        { label: 'goods' },
        { label: 'purchases', sub: '/my' },
        { label: 'acquire' },
        { label: 'shops' },
      ],
    },
    {
      label: 'mail',
      icon: IconMailbox,
      nested: [
        { label: 'deliveries' },
        { label: 'orders' },
        { label: 'stations' },
      ],
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
      label: 'map',
      icon: IconMap,
    },
    {
      label: 'users',
      icon: IconUsers,
    },
  ];

  const active = useLocation().pathname.split('/')[1];

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
                      onClick={() => {
                        notifications
                          .filter(
                            (notification) =>
                              notification.page === sublink.label,
                          )
                          .forEach((notification) =>
                            dispatch(
                              publishNotificationWithUser(notification.key),
                            ),
                          );
                        if (props.isMobile) {
                          props.close();
                        }
                      }}
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
                  to={`/${link.label}`}
                  active={link.label === active}
                  onClick={() => {
                    notifications
                      .filter(
                        (notification) => notification.page === link.label,
                      )
                      .forEach((notification) =>
                        dispatch(publishNotificationWithUser(notification.key)),
                      );
                    if (props.isMobile) {
                      props.close();
                    }
                  }}
                />
              ),
            )}
          </Navbar.Section>
        </Navbar>
      )}
    </>
  );
}
