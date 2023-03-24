import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { useGetAllPollsQuery } from '../../features/polls/polls.api';
import PollsTable from '../../features/polls/PollsTable';

export default function AllPolls() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({ user: '', description: '' });

  const response = useGetAllPollsQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
  ];

  return (
    <PollsTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      title='All Polls'
    />
  );
}
