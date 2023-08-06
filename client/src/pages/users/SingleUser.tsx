import { useParams } from 'react-router-dom';
import { Chip, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import { useGetSingleUserQuery } from '../../features/users/users.api';
import UserProfile from '../../features/users/UserProfile';
import CustomRating from '../../common/components/CustomRating';

export default function SingleUser() {
  useDocumentTitle('Single User | Shop');

  const { userId } = useParams();

  const { data: user, isFetching } = useGetSingleUserQuery(+userId!);

  return user && !isFetching ? (
    <UserProfile data={user} />
  ) : (
    <Stack align='center'>
      <Stack align='center' spacing={0}>
        <Skeleton h={64} w={64} />
        <Skeleton h={64} w={128} />
      </Stack>
      <Skeleton h={24} w={64} />
      <Group spacing={4}>
        {[...Array(3).keys()].map((key) => (
          <Skeleton key={key} h={16} w={40} />
        ))}
      </Group>
      <Chip disabled>Friend</Chip>
      <CustomRating />
      <Skeleton h={40} w={96} />
      <Group spacing={8}>
        {[...Array(3).keys()].map((key) => (
          <Skeleton key={key} h={32} w={64} />
        ))}
      </Group>
      <SimpleGrid
        cols={5}
        spacing={8}
        breakpoints={[{ maxWidth: 'xs', cols: 3 }]}
      >
        {[...Array(5).keys()].map((key) => (
          <Skeleton key={key} h={64} w={72} />
        ))}
      </SimpleGrid>
      <SimpleGrid
        cols={4}
        spacing={8}
        breakpoints={[{ maxWidth: 'xs', cols: 2 }]}
      >
        {[...Array(4).keys()].map((key) => (
          <Skeleton key={key} h={64} w={72} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
