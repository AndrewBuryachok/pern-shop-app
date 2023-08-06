import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMyStoragesQuery } from '../../features/storages/storages.api';
import StoragesTable from '../../features/storages/StoragesTable';
import { createStorageButton } from '../../features/storages/CreateStorageModal';
import { editStorageAction } from '../../features/storages/EditStorageModal';
import { createCellAction } from '../../features/cells/CreateCellModal';
import { Role } from '../../common/constants';

export default function MyStorages() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    card: null,
    storage: null,
    name: '',
  });

  const response = useGetMyStoragesQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', role: Role.MANAGER },
  ];

  const button = createStorageButton;

  const actions = [editStorageAction, createCellAction];

  return (
    <StoragesTable
      {...response}
      title='My Storages'
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
