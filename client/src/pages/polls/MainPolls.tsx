import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import {
  downVotePollAction,
  upVotePollAction,
} from '../../features/polls/VotePollModal';
import { Role } from '../../common/constants';

export default function MainPolls() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    title: searchParams.get('title') || '',
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = useGetMainPollsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.voted'), to: 'voted' },
    { label: t('pages.all'), to: 'all', role: Role.ADMIN },
  ];

  const actions = [upVotePollAction, downVotePollAction];

  return (
    <PollsTable
      {...response}
      title={t('pages.main') + ' ' + t('navbar.polls')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
