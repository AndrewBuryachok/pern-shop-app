import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetVotedPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import { Role } from '../../common/constants';

export default function VotedPolls() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    description: searchParams.get('description') || '',
  });

  const response = useGetVotedPollsQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.all'), to: '../all', role: Role.ADMIN },
  ];

  return (
    <PollsTable
      {...response}
      title={t('pages.voted') + ' ' + t('navbar.polls')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
