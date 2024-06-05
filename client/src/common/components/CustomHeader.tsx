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
  Tooltip,
} from '@mantine/core';
import { IconBroadcast, IconBroadcastOff } from '@tabler/icons';
import SettingsMenu from './SettingsMenu';
import NotificationsMenu from './NotificationsMenu';
import AccountMenu from './AccountMenu';

type Props = {
  openedN: boolean;
  openedA: boolean;
  toggleN: () => void;
  toggleA: () => void;
};

export default function CustomHeader(props: Props) {
  const [t] = useTranslation();

  return (
    <Header zIndex={200} height={60} px='md'>
      <Group h='100%' spacing={0} position='apart'>
        <Group spacing={8}>
          <Burger opened={props.openedN} onClick={props.toggleN} size='sm' />
          <Avatar component={Link} to='/' size={32} src='/logo.svg' />
          <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
            <Title order={1}>{t('header.title')}</Title>
          </MediaQuery>
        </Group>
        <Group spacing={8}>
          <Tooltip label={t('header.menu.streamers.title')} withArrow>
            <ActionIcon
              size={32}
              variant='filled'
              color='violet'
              onClick={props.toggleA}
            >
              {props.openedA ? (
                <IconBroadcastOff size={24} />
              ) : (
                <IconBroadcast size={24} />
              )}
            </ActionIcon>
          </Tooltip>
          <SettingsMenu />
          <NotificationsMenu />
          <AccountMenu />
        </Group>
      </Group>
    </Header>
  );
}
