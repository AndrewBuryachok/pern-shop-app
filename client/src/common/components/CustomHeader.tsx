import {
  Avatar,
  Burger,
  Group,
  Header,
  MediaQuery,
  Menu,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconLogin, IconLogout, IconMoon, IconSun } from '@tabler/icons';
import { useAppDispatch } from '../../app/hooks';
import {
  getCurrentUser,
  removeCurrentUser,
} from '../../features/auth/auth.slice';
import { useLogoutMutation } from '../../features/auth/auth.api';
import { openAuthModal } from '../../features/auth/AuthModal';

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
          <Burger
            opened={props.opened}
            onClick={() => props.toggle()}
            size='sm'
          />
        </MediaQuery>
        <Title order={1}>Shop</Title>
        <Menu offset={4} position='bottom-end'>
          <Menu.Target>
            <Avatar
              size={32}
              src={
                user?.name && `https://minotar.net/avatar/${user.name}/32.png`
              }
              alt={user?.name}
              style={{ cursor: 'pointer' }}
            />
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
              <Menu.Item icon={<IconLogout size={14} />} onClick={handleSubmit}>
                Logout
              </Menu.Item>
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
