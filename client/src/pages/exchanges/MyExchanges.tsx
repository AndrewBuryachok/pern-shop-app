import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyExchangesQuery } from '../../features/exchanges/exchanges.api';
import ExchangesTable from '../../features/exchanges/ExchangesTable';
import { Role } from '../../common/constants';

export default function MyExchanges() {
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

  const response = useGetMyExchangesQuery({ page, search });

  const links = [{ label: t('pages.all'), to: '../all', role: Role.BANKER }];

  return (
    <ExchangesTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.exchanges')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
