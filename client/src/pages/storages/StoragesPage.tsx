import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import {
  useGetAllStoragesQuery,
  useGetMainStoragesQuery,
  useGetMyStoragesQuery,
} from '../../features/storages/storages.api';
import StoragesTable from '../../features/storages/StoragesTable';
import {
  createMyStorageButton,
  createUserStorageButton,
} from '../../features/storages/CreateStorageModal';
import { editStorageAction } from '../../features/storages/EditStorageModal';

export default function StoragesPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    storage: searchParams.get('storage'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  });

  const response = {
    main: useGetMainStoragesQuery,
    my: useGetMyStoragesQuery,
    all: useGetAllStoragesQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyStorageButton,
    my: createMyStorageButton,
    all: createUserStorageButton,
  }[tab];

  const actions = { my: [editStorageAction], all: [editStorageAction] }[tab];

  return (
    <StoragesTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
