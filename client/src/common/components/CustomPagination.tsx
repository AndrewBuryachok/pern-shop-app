import { Pagination, Skeleton } from '@mantine/core';
import { IPagination } from '../interfaces/pagination';

type Props = IPagination & {
  total?: number;
  isLoading: boolean;
};

export default function CustomHead(props: Props) {
  return (
    <Skeleton visible={props.isLoading}>
      <Pagination
        withControls={false}
        total={props.total || 1}
        page={props.page}
        onChange={props.setPage}
      />
    </Skeleton>
  );
}
