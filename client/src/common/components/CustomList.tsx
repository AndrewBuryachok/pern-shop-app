import { Paper, Skeleton, Stack } from '@mantine/core';
import { IPage } from '../../common/interfaces';
import CustomPage from '../../common/components/CustomPage';

type Props<T> = IPage<T>;

export default function CustomsList<T>(props: Props<T>) {
  return (
    <CustomPage {...props}>
      {props.isFetching
        ? [...Array(10).keys()].map((key) => (
            <Paper key={key} p='md'>
              <Stack spacing={8}>
                <Skeleton h={32} w={128} />
                <Skeleton h={200} />
              </Stack>
            </Paper>
          ))
        : props.children}
    </CustomPage>
  );
}
