import { useLocation, useSearchParams } from 'react-router-dom';
import {
  useGetAllStoragesTagsQuery,
  useGetMainStoragesTagsQuery,
  useGetMyStoragesTagsQuery,
} from '../../features/storages-tags/storages-tags.api';
import StoragesTagsTable from '../../features/storages-tags/StoragesTagsTable';
import {
  createMyStorageTagButton,
  createUserStorageTagButton,
} from '../../features/storages-tags/CreateStorageTagModal';
import { editStorageTagAction } from '../../features/storages-tags/EditStorageTagModal';

export default function StoragesTagsPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    storage: searchParams.get('storage'),
    storageTag: searchParams.get('storageTag'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  };

  const response = {
    main: useGetMainStoragesTagsQuery,
    my: useGetMyStoragesTagsQuery,
    all: useGetAllStoragesTagsQuery,
  }[tab]!(search);

  const button = {
    main: createMyStorageTagButton,
    my: createMyStorageTagButton,
    all: createUserStorageTagButton,
  }[tab];

  const actions = { my: [editStorageTagAction], all: [editStorageTagAction] }[
    tab
  ];

  return (
    <StoragesTagsTable
      {...response}
      search={search}
      button={button}
      actions={actions}
    />
  );
}
