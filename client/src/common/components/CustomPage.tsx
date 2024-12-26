import { Container, Stack } from '@mantine/core';
import { IPage } from '../interfaces';
import CustomNav from './CustomNav';
import CustomHead from './CustomHead';
import CustomPagination from './CustomPagination';

type Props<T> = IPage<T> & { size: 'sm' | 'lg' };

export default function CustomPage<T>(props: Props<T>) {
  return (
    <Container size={props.size} px={0}>
      <Stack spacing={8}>
        <CustomNav {...props} />
        <CustomHead {...props} />
        {props.children}
        <CustomPagination
          page={props.search.page}
          count={props.data?.count}
          isFetching={props.isFetching}
        />
      </Stack>
    </Container>
  );
}
