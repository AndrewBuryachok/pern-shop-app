import { Group, Pagination, Skeleton } from '@mantine/core';
import { IPagination } from '../interfaces/pagination';

type Props = IPagination & {
  total?: number;
  isFetching: boolean;
};

export default function CustomHead(props: Props) {
  return props.isFetching ? (
    <Group spacing={8}>
      {[...Array(5).keys()].map((key) => (
        <Skeleton key={key} h={32} w={32} />
      ))}
    </Group>
  ) : (
    <Pagination
      withControls={false}
      total={props.total || 1}
      page={props.page}
      onChange={props.setPage}
    />
  );
}
