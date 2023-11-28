import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavLink, ScrollArea } from '@mantine/core';
import {
  IconBasket,
  IconBoxSeam,
  IconBuildingCommunity,
  IconChartBar,
  IconChecklist,
  IconContainer,
  IconFriends,
  IconHome,
  IconMap,
  IconNotes,
  IconReceipt,
  IconStar,
  IconTags,
  IconUsers,
  IconWallet,
} from '@tabler/icons';

type Props = {
  opened: boolean;
};

export default function CustomNavbar(props: Props) {
  const [t] = useTranslation();

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
      route: 'wallet',
      icon: IconWallet,
      nested: ['cards', 'payments', 'exchanges', 'invoices'],
      my: true,
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
      my: true,
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
      my: true,
    },
    {
      route: 'polls',
      icon: IconChartBar,
    },
    {
      route: 'votes',
      icon: IconNotes,
      my: true,
    },
    {
      route: 'friends',
      icon: IconFriends,
    },
    {
      route: 'ratings',
      icon: IconStar,
      my: true,
    },
    {
      route: 'tasks',
      icon: IconChecklist,
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
              label={t('navbar.' + link.route)}
              icon={<link.icon size={16} />}
              active={link.nested.includes(active)}
              childrenOffset={28}
            >
              {link.nested.map((route) => (
                <NavLink
                  key={route}
                  label={t('navbar.' + route)}
                  component={Link}
                  to={`${route}${link.my ? '/my' : ''}`}
                  active={route === active}
                />
              ))}
            </NavLink>
          ) : (
            <NavLink
              key={link.route}
              label={t('navbar.' + link.route)}
              icon={<link.icon size={16} />}
              component={Link}
              to={`/${link.route === 'home' ? '' : link.route}${
                link.my ? '/my' : ''
              }`}
              active={link.route === active}
            />
          ),
        )}
      </Navbar.Section>
    </Navbar>
  );
}
