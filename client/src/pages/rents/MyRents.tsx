import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyRentsQuery } from '../../features/rents/rents.api';
import RentsTable from '../../features/rents/RentsTable';
import { completeRentAction } from '../../features/rents/CompleteRentModal';
import { Role } from '../../common/constants';

export default function MyRents() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.RENTER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    market: searchParams.get('market'),
    store: searchParams.get('store'),
  });

  const response = useGetMyRentsQuery({ page, search });

  const links = [
    { label: t('pages.placed'), to: '../placed' },
    { label: t('pages.all'), to: '../all', role: Role.MANAGER },
  ];

  const actions = [completeRentAction];

  return (
    <RentsTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.rents')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
