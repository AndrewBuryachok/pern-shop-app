import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllMarketsQuery } from '../../features/markets/markets.api';
import MarketsTable from '../../features/markets/MarketsTable';
import { createUserMarketButton } from '../../features/markets/CreateMarketModal';
import { editMarketAction } from '../../features/markets/EditMarketModal';

export default function AllMarkets() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    market: searchParams.get('market'),
  });

  const response = useGetAllMarketsQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
  ];

  const button = createUserMarketButton;

  const actions = [editMarketAction];

  return (
    <MarketsTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.markets')}
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
