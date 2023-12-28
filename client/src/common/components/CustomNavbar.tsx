import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  ActionIcon,
  Group,
  Navbar,
  NavLink,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { hideNotification } from '@mantine/notifications';
import {
  IconArticle,
  IconBrandDiscord,
  IconBrandTelegram,
  IconBrandTiktok,
  IconBrandVk,
  IconBrandYoutube,
  IconBuildingSkyscraper,
  IconBuildingStadium,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconBulb,
  IconChecklist,
  IconMap,
  IconNews,
  IconPackage,
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
      route: 'reports',
      icon: IconNews,
    },
    {
      route: 'articles',
      icon: IconArticle,
    },
    {
      route: 'tasks',
      icon: IconChecklist,
    },
    {
      route: 'ratings',
      icon: IconStar,
      sub: '/top',
    },
    {
      route: 'polls',
      icon: IconBulb,
    },
    {
      route: 'map',
      icon: IconMap,
      nested: ['map', 'dynmap'],
    },
    {
      route: 'cities',
      icon: IconBuildingSkyscraper,
    },
    {
      route: 'wallet',
      icon: IconWallet,
      nested: ['cards/my', 'payments/my', 'exchanges/my', 'invoices/my'],
    },
    {
      route: 'trading',
      icon: IconBuildingStore,
      nested: ['goods', 'shops'],
    },
    {
      route: 'market',
      icon: IconBuildingStadium,
      nested: ['wares', 'trades/my', 'rents', 'stores', 'markets'],
    },
    {
      route: 'storage',
      icon: IconBuildingWarehouse,
      nested: [
        'products',
        'sales/my',
        'lots',
        'bids/my',
        'orders',
        'deliveries',
        'leases',
        'cells',
        'storages',
      ],
    },
    {
      route: 'users',
      icon: IconUsers,
    },
  ];

  const contacts = [
    {
      label: 'resourcepack',
      icon: IconPackage,
      to: 'https://www.dropbox.com/scl/fo/posgmqxx736wtzel7192p/h?rlkey=6ogoxj1ywom9d0vhpb4c3dou8&dl=1',
    },
    {
      label: 'discord',
      icon: IconBrandDiscord,
      to: 'https://discord.com/channels/720586627340304475/955064787425984562',
    },
    { label: 'vk', icon: IconBrandVk, to: 'https://vk.com/mine_square' },
    {
      label: 'telegram',
      icon: IconBrandTelegram,
      to: 'https://t.me/minesquare',
    },
    {
      label: 'youtube',
      icon: IconBrandYoutube,
      to: 'https://www.youtube.com/@MineSquareNET',
    },
    {
      label: 'tiktok',
      icon: IconBrandTiktok,
      to: 'https://www.tiktok.com/@minesquare.net',
    },
  ];

  const active = useLocation().pathname.split('/')[1];

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
              to={`/${link.route}${link.sub || ''}`}
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
      <Navbar.Section>
        <Group spacing={0} position='center' mr={-1}>
          {contacts.map((contact) => (
            <Tooltip
              key={contact.label}
              label={t(`footer.links.${contact.label}`)}
              withArrow
            >
              <ActionIcon
                size={24}
                component='a'
                href={contact.to}
                target='_blank'
              >
                {<contact.icon size={16} />}
              </ActionIcon>
            </Tooltip>
          ))}
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}
