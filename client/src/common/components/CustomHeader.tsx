import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Burger,
  Group,
  Header,
  Kbd,
  MediaQuery,
  Menu,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconBell,
  IconBellOff,
  IconLock,
  IconLogin,
  IconLogout,
  IconMoon,
  IconSun,
  IconUser,
  IconWorld,
} from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getCurrentUser,
  removeCurrentUser,
} from '../../features/auth/auth.slice';
import { toggleCurrentLanguage } from '../../features/lang/lang.slice';
import {
  getMute,
  publishOffline,
  toggleMute,
  unsubscribe,
} from '../../features/mqtt/mqtt.slice';
import { useLogoutMutation } from '../../features/auth/auth.api';
import { openAuthModal } from '../../features/auth/AuthModal';
import { openUpdatePasswordModal } from '../../features/auth/UpdatePasswordModal';

type Props = {
  opened: boolean;
  toggle: () => void;
};

export default function CustomHeader(props: Props) {
  const [t] = useTranslation();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { fullscreen, toggle: toggleFullscreen } = useFullscreen();
  const mute = getMute();

  const dispatch = useAppDispatch();

  const user = getCurrentUser();

  const [logout] = useLogoutMutation();

  const handleSubmit = async () => {
    await logout();
    dispatch(removeCurrentUser());
    dispatch(publishOffline(user!.id));
    dispatch(unsubscribe(user!.id));
  };

  return (
    <Header height={60} px='md'>
      <Group h='100%' spacing={0} position='apart'>
        <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
          <Burger opened={props.opened} onClick={props.toggle} size='sm' />
        </MediaQuery>
        <Title order={1}>{t('header.title')}</Title>
        <Menu offset={4} position='bottom-end' trigger='hover'>
          <Menu.Target>
            <Tooltip
              label={user?.nick}
              hidden={!user}
              position='left'
              withArrow
            >
              <Avatar
                size={32}
                src={
                  user?.nick &&
                  `${import.meta.env.VITE_AVATAR_URL}${
                    import.meta.env.VITE_HEAD_ROUTE
                  }${user.nick}`
                }
                alt={user?.nick}
                style={{ cursor: 'pointer' }}
              >
                {user?.nick.toUpperCase().slice(0, 2)}
              </Avatar>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{t('header.menu.settings.title')}</Menu.Label>
            <Menu.Item
              icon={<IconWorld size={16} />}
              onClick={() => dispatch(toggleCurrentLanguage())}
            >
              {t('header.menu.settings.language')} <Kbd>L</Kbd>
            </Menu.Item>
            <Menu.Item
              icon={dark ? <IconSun size={16} /> : <IconMoon size={16} />}
              onClick={() => toggleColorScheme()}
            >
              {dark
                ? t('header.menu.settings.theme.light')
                : t('header.menu.settings.theme.dark')}{' '}
              <Kbd>J</Kbd>
            </Menu.Item>
            <Menu.Item
              icon={
                fullscreen ? (
                  <IconArrowsMinimize size={16} />
                ) : (
                  <IconArrowsMaximize size={16} />
                )
              }
              onClick={() => toggleFullscreen()}
            >
              {fullscreen
                ? t('header.menu.settings.fullscreen.exit')
                : t('header.menu.settings.fullscreen.enter')}{' '}
              <Kbd>F</Kbd>
            </Menu.Item>
            <Menu.Item
              icon={mute ? <IconBell size={16} /> : <IconBellOff size={16} />}
              onClick={() => dispatch(toggleMute())}
            >
              {mute
                ? t('header.menu.settings.mute.off')
                : t('header.menu.settings.mute.on')}{' '}
              <Kbd>M</Kbd>
            </Menu.Item>
            <Menu.Label>{t('header.menu.account.title')}</Menu.Label>
            {user ? (
              <>
                <Menu.Item
                  icon={<IconUser size={16} />}
                  component={Link}
                  to={`/users/${user.id}`}
                >
                  {t('header.menu.account.profile')}
                </Menu.Item>
                <Menu.Item
                  icon={<IconLock size={16} />}
                  onClick={openUpdatePasswordModal}
                >
                  {t('header.menu.account.password')}
                </Menu.Item>
                <Menu.Item
                  icon={<IconLogout size={16} />}
                  onClick={handleSubmit}
                >
                  {t('header.menu.account.logout')}
                </Menu.Item>
              </>
            ) : (
              <Menu.Item icon={<IconLogin size={16} />} onClick={openAuthModal}>
                {t('header.menu.account.login')}
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Header>
  );
}
