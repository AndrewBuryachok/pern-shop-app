import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ActionIcon,
  Avatar,
  Burger,
  Group,
  Header,
  MediaQuery,
  Title,
} from '@mantine/core';
import { IconCoin } from '@tabler/icons';
import SettingsMenu from './SettingsMenu';
import NotificationsMenu from './NotificationsMenu';
import AccountMenu from './AccountMenu';

type Props = {
  opened: boolean;
  toggle: () => void;
};

export default function CustomHeader(props: Props) {
  const [t] = useTranslation();

  return (
    <Header height={60} px='md'>
      <Group h='100%' spacing={0} position='apart'>
        <Group spacing={8}>
          <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
            <Burger opened={props.opened} onClick={props.toggle} size='sm' />
          </MediaQuery>
          <Avatar component={Link} to='/' size={32} src='/logo.png' />
          <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
            <Title order={1}>{t('header.title')}</Title>
          </MediaQuery>
        </Group>
        <Group spacing={8}>
          <SettingsMenu />
          <ActionIcon
            size={32}
            variant='filled'
            color='green'
            component={Link}
            to='/donate'
          >
            <IconCoin size={24} />
          </ActionIcon>
          <NotificationsMenu />
          <AccountMenu />
        </Group>
      </Group>
    </Header>
  );
}
