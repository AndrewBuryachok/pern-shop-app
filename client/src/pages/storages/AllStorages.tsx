import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllStoragesQuery } from '../../features/storages/storages.api';
import StoragesTable from '../../features/storages/StoragesTable';
import { createUserStorageButton } from '../../features/storages/CreateStorageModal';
import { editStorageAction } from '../../features/storages/EditStorageModal';

export default function AllStorages() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    storage: searchParams.get('storage'),
  });

  const response = useGetAllStoragesQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
  ];

  const button = createUserStorageButton;

  const actions = [editStorageAction];

  return (
    <StoragesTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.storages')}
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
