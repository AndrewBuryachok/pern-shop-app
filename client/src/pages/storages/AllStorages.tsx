import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllStoragesQuery } from '../../features/storages/storages.api';
import StoragesTable from '../../features/storages/StoragesTable';
import { createUserStorageButton } from '../../features/storages/CreateStorageModal';
import { editStorageAction } from '../../features/storages/EditStorageModal';

export default function AllStorages() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    storage: null,
    name: '',
  });

  const response = useGetAllStoragesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  const button = createUserStorageButton;

  const actions = [editStorageAction];

  return (
    <StoragesTable
      {...response}
      title='All Storages'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
