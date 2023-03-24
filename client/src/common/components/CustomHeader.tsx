import { Link } from 'react-router-dom';
import {
  Avatar,
  Burger,
  Group,
  Header,
  MediaQuery,
  Menu,
  Title,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconLock,
  IconLogin,
  IconLogout,
  IconMoon,
  IconSun,
  IconUser,
} from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getCurrentUser,
  removeCurrentUser,
} from '../../features/auth/auth.slice';
import { useLogoutMutation } from '../../features/auth/auth.api';
import { openAuthModal } from '../../features/auth/AuthModal';
import { openUpdatePasswordModal } from '../../features/auth/UpdatePasswordModal';

type Props = {
  opened: boolean;
  toggle: () => void;
};

export default function CustomHeader(props: Props) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const dispatch = useAppDispatch();

  const user = getCurrentUser();

  const [logout] = useLogoutMutation();

  const handleSubmit = async () => {
    await logout();
    dispatch(removeCurrentUser());
  };

  return (
    <Header height={60} px='md'>
      <Group sx={{ height: '100%' }} position='apart'>
        <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
          <Burger opened={props.opened} onClick={props.toggle} size='sm' />
        </MediaQuery>
        <Title order={1}>Shop</Title>
        <Menu offset={4} position='bottom-end'>
          <Menu.Target>
            <Tooltip
              label={user?.name}
              hidden={!user}
              position='left'
              withArrow
            >
              <Avatar
                size={32}
                color='violet'
                src={
                  user?.name &&
                  `${import.meta.env.VITE_AVATAR_URL}${
                    import.meta.env.VITE_HEAD_ROUTE
                  }${user.name}`
                }
                alt={user?.name}
                style={{ cursor: 'pointer' }}
              />
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              icon={dark ? <IconSun size={14} /> : <IconMoon size={14} />}
              onClick={() => toggleColorScheme()}
            >
              {dark ? 'Light' : 'Dark'} theme
            </Menu.Item>
            <Menu.Label>Account</Menu.Label>
            {user ? (
              <>
                <Menu.Item
                  icon={<IconUser size={14} />}
                  component={Link}
                  to={`/users/${user.id}`}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  icon={<IconLock size={14} />}
                  onClick={openUpdatePasswordModal}
                >
                  Password
                </Menu.Item>
                <Menu.Item
                  icon={<IconLogout size={14} />}
                  onClick={handleSubmit}
                >
                  Logout
                </Menu.Item>
              </>
            ) : (
              <Menu.Item icon={<IconLogin size={14} />} onClick={openAuthModal}>
                Login
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Header>
  );
}
