import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllStoragesQuery } from '../../features/storages/storages.api';
import StoragesTable from '../../features/storages/StoragesTable';

export default function AllStorages() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', name: '' });

  const response = useGetAllStoragesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <StoragesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Storages'
    />
  );
}
