import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetAllTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';

export default function AllTasks() {
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

  const response = useGetAllTasksQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'My', to: '../my' },
    { label: 'Taken', to: '../taken' },
    { label: 'Placed', to: '../placed' },
  ];

  return (
    <TasksTable
      {...response}
      title='All Tasks'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
    />
  );
}
