import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Avatar, Menu } from '@mantine/core';
import { IconLock, IconLogin, IconLogout, IconUser } from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getCurrentUser,
  removeCurrentUser,
} from '../../features/auth/auth.slice';
import { publishOffline, unsubscribe } from '../../features/mqtt/mqtt.slice';
import { useLogoutMutation } from '../../features/auth/auth.api';
import { openAuthModal } from '../../features/auth/AuthModal';
import { openUpdatePasswordModal } from '../../features/auth/UpdatePasswordModal';

export default function AccountMenu() {
  const [t] = useTranslation();

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
    <Menu offset={4} position='bottom-end' trigger='hover'>
      <Menu.Target>
        <Avatar
          size={32}
          variant='filled'
          color='violet'
          src={
            user &&
            `${import.meta.env.VITE_AVATAR_URL}${
              import.meta.env.VITE_HEAD_ROUTE
            }${user.avatar || user.nick}`
          }
          alt={user?.nick}
          style={{ cursor: 'pointer' }}
        >
          {user?.nick.toUpperCase().slice(0, 2)}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
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
            <Menu.Item icon={<IconLogout size={16} />} onClick={handleSubmit}>
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
  );
}