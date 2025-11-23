import { AspectRatio, Group, Paper, Skeleton, Stack } from '@mantine/core';
import { IPage } from '../../common/interfaces';
import CustomPage from '../../common/components/CustomPage';

type Props<T> = IPage<T>;

export default function CustomList<T>(props: Props<T>) {
  return (
    <CustomPage size='sm' {...props}>
      {props.isFetching
        ? [...Array(10).keys()].map((key) => (
            <Paper key={key} p='md'>
              <Stack spacing={8}>
                <Group spacing={0} position='apart'>
                  <Group spacing={8}>
                    <Skeleton w={32} h={32} />
                    <Skeleton w={128} h={16} />
                  </Group>
                  <Skeleton w={72} h={24} />
                </Group>
                <Skeleton h={32} />
                <AspectRatio ratio={16 / 9}>
                  <Skeleton />
                </AspectRatio>
                <Group spacing={0} position='apart'>
                  <Group spacing={8}>
                    <Skeleton w={64} h={24} />
                    <Skeleton w={64} h={24} />
                    <Skeleton w={64} h={24} />
                  </Group>
                  <Skeleton w={64} h={24} />
                </Group>
              </Stack>
            </Paper>
          ))
        : props.children}
    </CustomPage>
  );
}
