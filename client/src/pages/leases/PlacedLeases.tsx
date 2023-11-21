import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedLeasesQuery } from '../../features/leases/leases.api';
import LeasesTable from '../../features/leases/LeasesTable';
import { Role } from '../../common/constants';

export default function PlacedLeases() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.RENTER, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    storage: searchParams.get('storage'),
    cell: searchParams.get('cell'),
    kind: +(searchParams.get('kind') || 0) || null,
  });

  const response = useGetPlacedLeasesQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.all'), to: '../all', role: Role.MANAGER },
  ];

  return (
    <LeasesTable
      {...response}
      title={t('pages.placed') + ' ' + t('navbar.leases')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}