import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllRentsQuery } from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';

export default function AllRents() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    filters: ['Mode', 'Renter', 'Lessor'].map((label, index) => ({
      label,
      value: !!index,
    })),
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
