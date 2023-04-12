import { Link, useLocation } from 'react-router-dom';
import { Navbar, NavLink, ScrollArea } from '@mantine/core';
import {
  IconBasket,
  IconBoxSeam,
  IconBuildingCommunity,
  IconChartBar,
  IconContainer,
  IconFriends,
  IconHome,
  IconMap,
  IconNotes,
  IconReceipt,
  IconTags,
  IconUsers,
  IconWallet,
} from '@tabler/icons';

type Props = {
  opened: boolean;
};

export default function CustomNavbar(props: Props) {
  const links = [
    {
      label: 'Home',
      icon: IconHome,
    },
    {
      label: 'Users',
      icon: IconUsers,
    },
    {
      label: 'Wallet',
      icon: IconWallet,
      nested: ['Cards', 'Payments', 'Exchanges', 'Invoices'],
      my: true,
    },
    {
      label: 'Things',
      icon: IconBasket,
      nested: ['Goods', 'Wares', 'Products'],
    },
    {
      label: 'Purchases',
      icon: IconTags,
      nested: ['Trades', 'Sales'],
      my: true,
    },
    {
      label: 'Transportations',
      icon: IconBoxSeam,
      nested: ['Orders', 'Deliveries'],
    },
    {
      label: 'Map',
      icon: IconMap,
    },
    {
      label: 'Places',
      icon: IconBuildingCommunity,
      nested: ['Cities', 'Shops', 'Markets', 'Storages'],
    },
    {
      label: 'Containers',
      icon: IconContainer,
      nested: ['Stores', 'Cells'],
    },
    {
      label: 'Receipts',
      icon: IconReceipt,
      nested: ['Rents', 'Leases'],
      my: true,
    },
    {
      label: 'Polls',
      icon: IconChartBar,
    },
    {
      label: 'Votes',
      icon: IconNotes,
      my: true,
    },
    {
      label: 'Friends',
      icon: IconFriends,
    },
  ];

  const location = useLocation().pathname.split('/')[1] || 'home';

  const active = location.charAt(0).toUpperCase() + location.substring(1);

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
              key={link.label}
              label={link.label}
              icon={<link.icon size={16} />}
              active={link.nested.includes(active)}
              childrenOffset={28}
            >
              {link.nested.map((label) => (
                <NavLink
                  key={label}
                  label={label}
                  component={Link}
                  to={`${label.toLocaleLowerCase()}${link.my ? '/my' : ''}`}
                  active={label === active}
                />
              ))}
            </NavLink>
          ) : (
            <NavLink
              key={link.label}
              label={link.label}
              icon={<link.icon size={16} />}
              active={link.label === active}
              component={Link}
              to={`/${
                link.label === 'Home' ? '' : link.label.toLocaleLowerCase()
              }${link.my ? '/my' : ''}`}
            />
          ),
        )}
      </Navbar.Section>
    </Navbar>
  );
}
