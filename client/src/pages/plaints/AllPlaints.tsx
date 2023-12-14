import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllPlaintsQuery } from '../../features/plaints/plaints.api';
import PlaintsTable from '../../features/plaints/PlaintsTable';
import { completePlaintAction } from '../../features/plaints/CompletePlaintModal';

export default function AllPlaints() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER, Mode.EXECUTOR],
    mode: searchParams.get('mode') as Mode,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = useGetAllPlaintsQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.received'), to: '../received' },
  ];

  const actions = [completePlaintAction];

  return (
    <PlaintsTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.plaints')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
