import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainShopsQuery } from '../../features/shops/shops.api';
import ShopsTable from '../../features/shops/ShopsTable';
import { Role } from '../../common/constants';

export default function MainShops() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    shop: searchParams.get('shop'),
  });

  const response = useGetMainShopsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.all'), to: 'all', role: Role.MANAGER },
  ];

  return (
    <ShopsTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.shops')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
