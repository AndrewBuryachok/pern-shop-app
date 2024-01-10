import { Group, Paper, Skeleton, Stack } from '@mantine/core';
import { IPage } from '../../common/interfaces';
import CustomPage from '../../common/components/CustomPage';

type Props<T> = IPage<T>;

export default function CustomList<T>(props: Props<T>) {
  return (
    <CustomPage {...props}>
      {props.isLoading
        ? [...Array(10).keys()].map((key) => (
            <Paper key={key} p='md'>
              <Stack spacing={8}>
                <Skeleton w={128} h={32} />
                <Skeleton h={32} />
                <Skeleton h={200} />
                <Group spacing={8}>
                  <Skeleton w={64} h={24} />
                  <Skeleton w={64} h={24} />
                  <Skeleton w={64} h={24} />
                </Group>
              </Stack>
            </Paper>
          ))
        : props.children}
    </CustomPage>
  );
}
