import { useLocation } from 'react-router-dom';
import { Stack } from '@mantine/core';
import { IPage } from '../interfaces';
import CustomNav from './CustomNav';
import CustomStats from './CustomStats';
import CustomHead from './CustomHead';
import CustomPagination from './CustomPagination';
import { ROWS_PER_PAGE } from '../constants';

type Props<T> = IPage<T>;

export default function CustomPage<T>(props: Props<T>) {
  const active = useLocation().pathname.split('/');

  return (
    <Stack spacing={8}>
      <CustomNav {...props} />
      {['goods', 'wares', 'products'].includes(active[1]) &&
        active.length === 2 && <CustomStats />}
      <CustomHead {...props} />
      {props.children}
      <CustomPagination
        {...props}
        total={props.data && Math.ceil(props.data.count / ROWS_PER_PAGE)}
      />
    </Stack>
  );
}
