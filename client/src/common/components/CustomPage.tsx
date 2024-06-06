import { useLocation } from 'react-router-dom';
import { Container, Stack } from '@mantine/core';
import { IPage } from '../interfaces';
import CustomNav from './CustomNav';
import CustomStats from './CustomStats';
import CustomHead from './CustomHead';
import CustomPagination from './CustomPagination';

type Props<T> = IPage<T>;

export default function CustomPage<T>(props: Props<T>) {
  const active = useLocation().pathname.split('/');

  return (
    <Container size='md' px={0}>
      <Stack spacing={8}>
        <CustomNav {...props} />
        {['goods', 'wares', 'products'].includes(active[1]) &&
          active.length === 2 && <CustomStats />}
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
