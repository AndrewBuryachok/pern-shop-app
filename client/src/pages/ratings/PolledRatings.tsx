import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPolledRatingsQuery } from '../../features/ratings/ratings.api';
import RatingsTable from '../../features/ratings/RatingsTable';
import { Role } from '../../common/constants';

export default function PolledRatings() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.SENDER, Mode.RECEIVER],
    mode: searchParams.get('mode') as Mode,
    rate: +(searchParams.get('rate') || 0) || null,
  });

  const response = useGetPolledRatingsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.all'), to: '../all', role: Role.ADMIN },
  ];

  return (
    <RatingsTable
      {...response}
      title={t('pages.polled') + ' ' + t('navbar.ratings')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
