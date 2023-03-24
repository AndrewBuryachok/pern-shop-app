import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';

export default function AllStores() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', name: '' });

  const response = useGetAllStoresQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <StoresTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Stores'
    />
  );
}
