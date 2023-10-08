import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPolledRatingsQuery } from '../../features/ratings/ratings.api';
import RatingsTable from '../../features/ratings/RatingsTable';
import { Role } from '../../common/constants';

export default function PolledRatings() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: null,
    rate: null,
  });

  const response = useGetPolledRatingsQuery({ page, search });

  const links = [
    { label: 'My', to: '../my' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  return (
    <RatingsTable
      {...response}
      title='Polled Ratings'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
