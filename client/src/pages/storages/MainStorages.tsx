import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetMainStoragesQuery } from '../../features/storages/storages.api';
import StoragesTable from '../../features/storages/StoragesTable';
import { isUserNotHasRole } from '../../common/utils';
import { Role } from '../../common/constants';

export default function MainStorages() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: '',
    card: '',
    storage: '',
    name: '',
  });

  const response = useGetMainStoragesQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'All', to: 'all', disabled: isUserNotHasRole(Role.MANAGER) },
  ];

  return (
    <StoragesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='Main Storages'
    />
  );
}
