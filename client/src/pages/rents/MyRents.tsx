import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyRentsQuery } from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';
import { Role } from '../../common/constants';

export default function MyRents() {
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

  const response = useGetMyRentsQuery({ page, search });

  const links = [{ label: 'All', to: '../all', role: Role.MANAGER }];

  return (
    <RentsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='My Rents'
    />
  );
}
