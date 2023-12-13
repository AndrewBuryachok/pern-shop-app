import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainPlaintsQuery } from '../../features/plaints/plaints.api';
import PlaintsTable from '../../features/plaints/PlaintsTable';
import { Role } from '../../common/constants';

export default function MainPlaints() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER, Mode.EXECUTOR],
    mode: searchParams.get('mode') as Mode,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = useGetMainPlaintsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.received'), to: 'received' },
    { label: t('pages.all'), to: 'all', role: Role.JUDGE },
  ];

  return (
    <PlaintsTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.plaints')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
