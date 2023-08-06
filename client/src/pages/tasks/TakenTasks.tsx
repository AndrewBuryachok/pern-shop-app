import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetTakenTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { untakeTaskAction } from '../../features/tasks/UntakeTaskModal';
import { executeTaskAction } from '../../features/tasks/ExecuteTaskModal';
import { Role } from '../../common/constants';

export default function TakenTasks() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    filters: [Filter.CUSTOMER, Filter.EXECUTOR, Filter.OWNER].map((label) => ({
      label,
      value: true,
    })),
    mode: Mode.SOME,
    city: null,
    description: '',
    priority: null,
    status: null,
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
