import { useParams } from 'react-router-dom';
import { Group, Skeleton, Stack } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useGetSingleUserQuery } from '../../features/users/users.api';
import UserProfile from '../../features/users/UserProfile';
import FriendChip from '../../common/components/FriendChip';

export default function SingleUser() {
  useDocumentTitle('Single User | Shop');

  const { userId } = useParams();

  const { data: user } = useGetSingleUserQuery(+userId!);

  return user ? (
    <UserProfile data={user} />
  ) : (
    <Stack align='center'>
      <Skeleton h={128} w={128} />
      <Skeleton h={24} w={64} />
      <Group spacing={4}>
        {[...Array(3).keys()].map((key) => (
          <Skeleton key={key} h={16} w={40} />
        ))}
      </Group>
      <FriendChip />
      <Skeleton h={40} w={96} />
      <Group spacing={8}>
        {[...Array(3).keys()].map((key) => (
          <Skeleton key={key} h={32} w={64} />
        ))}
      </Group>
      <Group spacing={8}>
        {[...Array(5).keys()].map((key) => (
          <Skeleton key={key} h={64} w={72} />
        ))}
      </Group>
    </Stack>
  );
}
