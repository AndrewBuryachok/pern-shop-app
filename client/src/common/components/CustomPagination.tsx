import { useSearchParams } from 'react-router-dom';
import { Pagination } from '@mantine/core';
import { ROWS_PER_PAGE } from '../constants';

type Props = {
  page: number;
  count?: number;
  isFetching: boolean;
};

export default function CustomHead(props: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newSearchParams.delete('page');
    } else {
      newSearchParams.set('page', `${page}`);
    }
    setSearchParams(newSearchParams);
  };

  return (
    <Pagination
      total={props.count ? Math.ceil(props.count / ROWS_PER_PAGE) : 1}
      page={props.page}
      onChange={handleChange}
      withControls={false}
      disabled={props.isFetching}
    />
  );
}
