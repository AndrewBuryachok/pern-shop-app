import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMainTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { takeTaskAction } from '../../features/tasks/TakeTaskModal';
import { Role } from '../../common/constants';

export default function MainTasks() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState<ISearch>({
    user: null,
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: null,
    city: null,
    description: '',
    priority: null,
    status: null,
  });

  const response = useGetMainTasksQuery({ page, search });

  const links = [
    { label: 'My', to: 'my' },
    { label: 'Taken', to: 'taken' },
    { label: 'Placed', to: 'placed' },
    { label: 'All', to: 'all', role: Role.ADMIN },
  ];

  const actions = [takeTaskAction];

  return (
    <TasksTable
      {...response}
      title='Main Tasks'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      actions={actions}
    />
  );
}
