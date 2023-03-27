import { Pagination } from '@mantine/core';
import { IPagination } from '../interfaces/pagination';

type Props = IPagination & {
  total?: number;
  isFetching: boolean;
};

export default function CustomHead(props: Props) {
  return (
    <Pagination
      total={props.total || 1}
      page={props.page}
      onChange={props.setPage}
      withControls={false}
      disabled={props.isFetching}
    />
  );
}
