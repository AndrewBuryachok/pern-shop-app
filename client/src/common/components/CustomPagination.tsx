import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '@mantine/core';
import { IPagination } from '../interfaces/pagination.interface';

type Props = IPagination & {
  total?: number;
  isFetching: boolean;
};

export default function CustomHead(props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (props.page === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', `${props.page}`);
    }
    setSearchParams(newSearchParams);
  }, [props.page]);

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
