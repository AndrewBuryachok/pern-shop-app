import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { useGetAllPollsQuery } from '../../features/polls/polls.api';
import { completePollAction } from '../../features/polls/CompletePollModal';
import { deletePollAction } from '../../features/polls/DeletePollModal';
import PollsTable from '../../features/polls/PollsTable';

export default function AllPolls() {
  const [t] = useTranslation();

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    description: '',
  });

  const response = useGetAllPollsQuery({ page, search });

  const links = [
    { label: t('pages.main'), to: '..' },
    { label: t('pages.my'), to: '../my' },
    { label: t('pages.voted'), to: '../voted' },
  ];

  const actions = [completePollAction, deletePollAction];

  return (
    <PollsTable
      {...response}
      title={t('pages.all') + ' ' + t('navbar.polls')}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
