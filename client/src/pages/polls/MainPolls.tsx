import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetMainPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';
import {
  createDownVoteAction,
  createUpVoteAction,
} from '../../features/polls/VotePollModal';
import { Role } from '../../common/constants';

export default function MainPolls() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    description: searchParams.get('description') || '',
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = useGetMainPollsQuery({ page, search });

  const links = [
    { label: t('pages.my'), to: 'my' },
    { label: t('pages.voted'), to: 'voted' },
    { label: t('pages.all'), to: 'all', role: Role.ADMIN },
  ];

  const actions = [createUpVoteAction, createDownVoteAction];

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
