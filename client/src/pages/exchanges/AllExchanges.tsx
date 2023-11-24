import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { createExchangeButton } from '../../features/exchanges/CreateExchangeModal';

export default function AllExchanges() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.EXECUTOR, Mode.CUSTOMER],
    mode: searchParams.get('mode') as Mode,
    type: searchParams.get('type'),
    minSum: +(searchParams.get('minSum') || 0) || null,
    maxSum: +(searchParams.get('maxSum') || 0) || null,
  });

  const response = useGetAllExchangesQuery({ page, search });

  const links = [{ label: t('pages.my'), to: '../my' }];

  const button = createExchangeButton;

  return (
    <ExchangesTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.exchanges')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
    />
  );
}
