import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllStoresQuery } from '../../features/stores/stores.api';
import StoresTable from '../../features/stores/StoresTable';
import { createUserStoreButton } from '../../features/stores/CreateStoreModal';
import { reserveUserStoreAction } from '../../features/stores/ReserveStoreModal';

export default function AllStores() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    store: searchParams.get('store'),
  });

  const response = useGetAllStoresQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
  ];

  const button = createUserStoreButton;

  const actions = [reserveUserStoreAction];

  return (
    <StoresTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.stores')}
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
