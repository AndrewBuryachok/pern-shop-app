import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useGetMyStoragesQuery } from '../../features/storages/storages.api';
import StoragesTable from '../../features/storages/StoragesTable';
import { createStorageButton } from '../../features/storages/CreateStorageModal';
import { editStorageAction } from '../../features/storages/EditStorageModal';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MyStorages() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');

  const [debounced] = useDebouncedValue(search, 300);

  const response = useGetMyStoragesQuery({ page, search: debounced });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'All', to: '../all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  const button = createStorageButton;

  const actions = [editStorageAction];

  return (
    <StoragesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      title='My Storages'
      actions={actions}
    />
  );
}
