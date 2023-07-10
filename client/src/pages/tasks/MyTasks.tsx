import { useState } from 'react';
import { ISearch } from '../../common/interfaces';
import { Filter, Mode } from '../../common/enums';
import { useGetMyTasksQuery } from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { createTaskButton } from '../../features/tasks/CreateTaskModal';
import { completeTaskAction } from '../../features/tasks/CompleteTaskModal';
import { deleteTaskAction } from '../../features/tasks/DeleteTaskModal';
import { Role } from '../../common/constants';

export default function MyTasks() {
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
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      links={links}
      button={button}
      actions={actions}
      title='My Tasks'
    />
  );
}
