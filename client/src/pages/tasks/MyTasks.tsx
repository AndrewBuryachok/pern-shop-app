import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import { useGetMyTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { createTaskButton } from '../../features/tasks/CreateTaskModal';
import { completeTaskAction } from '../../features/tasks/CompleteTaskModal';
import { deleteTaskAction } from '../../features/tasks/DeleteTaskModal';
import { Role } from '../../common/constants';

export default function MyTasks() {
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

  const response = useGetMyTasksQuery({ page, search });

  const links = [
    { label: 'Main', to: '..' },
    { label: 'Taken', to: '../taken' },
    { label: 'Placed', to: '../placed' },
    { label: 'All', to: '../all', role: Role.ADMIN },
  ];

  const button = createTaskButton;

  const actions = [completeTaskAction, deleteTaskAction];

  return (
    <TasksTable
      {...response}
      title='My Tasks'
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
    />
  );
}
