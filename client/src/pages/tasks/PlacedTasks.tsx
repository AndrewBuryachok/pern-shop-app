import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetPlacedTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { Role } from '../../common/constants';

export default function PlacedTasks() {
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

  const response = useGetPlacedTasksQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Taken', to: '../taken' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  return (
    <TasksTable
      {...response}
      title='Placed Tasks'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
