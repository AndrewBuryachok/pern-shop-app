import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyVotesQuery } from '../../features/votes/votes.api';
import VotesTable from '../../features/votes/VotesTable';
import { Role } from '../../common/constants';

export default function MyVotes() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.VOTER, Mode.POLLER],
    mode: searchParams.get('mode') as Mode,
    description: searchParams.get('description') || '',
    type: searchParams.get('type'),
  });

  const response = useGetMyVotesQuery({ page, search });

  const links = [
    { label: t('pages.polled'), to: '../polled' },
    { label: t('pages.all'), to: '../all', role: Role.ADMIN },
  ];

  return (
    <VotesTable
      {...response}
      title={t('pages.my') + ' ' + t('navbar.votes')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
