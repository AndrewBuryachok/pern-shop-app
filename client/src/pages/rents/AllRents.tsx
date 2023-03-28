import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetAllRentsQuery } from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';

export default function AllRents() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    filters: [Filter.RENTER, Filter.OWNER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    market: null,
    store: null,
  });

  const response = useGetAllRentsQuery({ page, search });

  const links = [{ label: 'My', to: '../my' }];

  return (
    <RentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Rents'
    />
  );
}
