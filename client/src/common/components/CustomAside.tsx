import { Aside, Button, ScrollArea, Stack, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { useSelectTwitchUsersQuery } from '../../features/users/users.api';
import CustomStream from './CustomStream';

type Props = {
  opened: boolean;
};

export default function CustomAside(props: Props) {
  const { data: users } = useSelectTwitchUsersQuery();

  return (
    <>
      {props.opened && (
        <Aside
          p='md'
          hiddenBreakpoint='sm'
          hidden={!props.opened}
          width={{ sm: 200, lg: 300 }}
          withBorder={false}
        >
          <Aside.Section component={ScrollArea} grow>
            <Stack spacing={8}>
              <Title order={3}>Стримеры</Title>
              {users?.live.map((user) => (
                <CustomStream key={user} nick={user} />
              ))}
              <Button
                component='a'
                href={import.meta.env.VITE_TWITCH_FORM}
                target='_blank'
                variant='filled'
                color='violet'
                compact
              >
                <IconPlus size={16} />
              </Button>
              {users?.unlive.map((user) => (
                <CustomStream key={user} nick={user} />
              ))}
            </Stack>
          </Aside.Section>
        </Aside>
      )}
    </>
  );
}
