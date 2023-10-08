import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllRatingsQuery } from '../../features/ratings/ratings.api';
import RatingsTable from '../../features/ratings/RatingsTable';

export default function AllRatings() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetAllRatingsQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'Polled', to: '../polled' },
  ];

  return (
    <RatingsTable
      {...response}
      title='All Ratings'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
