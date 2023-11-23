import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainMarketsQuery } from '../../features/markets/markets.api';
import MarketsTable from '../../features/markets/MarketsTable';
import { Role } from '../../common/constants';

export default function MainMarkets() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
  });

  const response = useGetMainMarketsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.all'), to: 'all', role: Role.MANAGER },
  ];

  return (
    <MarketsTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.markets')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
