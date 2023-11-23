import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMyMarketsQuery } from '../../features/markets/markets.api';
import MarketsTable from '../../features/markets/MarketsTable';
import { createMyMarketButton } from '../../features/markets/CreateMarketModal';
import { editMarketAction } from '../../features/markets/EditMarketModal';
import { Role } from '../../common/constants';

export default function MyMarkets() {
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

  const response = useGetMyMarketsQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.all'), to: '../all', role: Role.MANAGER },
  ];

  const button = createMyMarketButton;

  const actions = [editMarketAction];

  return (
    <MarketsTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.markets')}
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
