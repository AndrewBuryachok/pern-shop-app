import { Affix, Badge, Group, Paper, Text } from '@mantine/core';
import { IconUsers } from '@tabler/icons';
import { getOnlineUsers } from '../../features/mqtt/mqtt.slice';

export default function CustomAffix() {
  const users = getOnlineUsers();

  return (
    <Affix position={{ bottom: 16, right: 16 }}>
      <Paper p={8} withBorder>
        <Group spacing={4}>
          <Badge w={8} h={8} p={0} variant='filled' color='green' />
          <IconUsers size={16} />
          <Text size='xs'>{users.length}</Text>
        </Group>
      </Paper>
    </Affix>
  );
}
