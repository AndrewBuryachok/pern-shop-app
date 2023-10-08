import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllRentsQuery } from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';

export default function AllRents() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    modes: [Mode.RENTER, Mode.OWNER],
    mode: null,
    market: null,
    store: null,
  });

  const response = useGetAllRentsQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <RentsTable
      {...response}
      title='All Rents'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
