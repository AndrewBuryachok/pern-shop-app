import { useLocation, useSearchParams } from 'react-router-dom';
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

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    storage: searchParams.get('storage'),
  };

  const response = {
    main: useGetMainStoragesQuery,
    my: useGetMyStoragesQuery,
    all: useGetAllStoragesQuery,
  }[tab]!(search);

  const button = {
    main: createMyStorageButton,
    my: createMyStorageButton,
    all: createUserStorageButton,
  }[tab];

  const actions = { my: [editStorageAction], all: [editStorageAction] }[tab];

  return (
    <StoragesTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
