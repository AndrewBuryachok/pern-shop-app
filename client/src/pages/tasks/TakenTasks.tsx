import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetTakenTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { untakeTaskAction } from '../../features/tasks/UntakeTaskModal';
import { executeTaskAction } from '../../features/tasks/ExecuteTaskModal';
import { Role } from '../../common/constants';

export default function TakenTasks() {
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    user: searchParams.get('user'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    city: searchParams.get('city'),
    description: '',
    priority: +(searchParams.get('priority') || 0) || null,
    status: +(searchParams.get('status') || 0) || null,
  });

  const response = useGetTakenTasksQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const actions = [untakeTaskAction, executeTaskAction];

  return (
    <TasksTable
      {...response}
      title='Taken Tasks'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
