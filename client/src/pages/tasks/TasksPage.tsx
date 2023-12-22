import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllTasksQuery,
  useGetMainTasksQuery,
  useGetMyTasksQuery,
  useGetPlacedTasksQuery,
  useGetTakenTasksQuery,
} from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import { createTaskButton } from '../../features/tasks/CreateTaskModal';
import { takeTaskAction } from '../../features/tasks/TakeTaskModal';
import { executeTaskAction } from '../../features/tasks/ExecuteTaskModal';
import { completeTaskAction } from '../../features/tasks/CompleteTaskModal';
import { untakeTaskAction } from '../../features/tasks/UntakeTaskModal';
import { deleteTaskAction } from '../../features/tasks/DeleteTaskModal';

export default function MyTasks() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR, Mode.OWNER],
    mode: searchParams.get('mode') as Mode,
    city: searchParams.get('city'),
    title: searchParams.get('title') || '',
    priority: searchParams.get('priority'),
    status: searchParams.get('status'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainTasksQuery,
    my: useGetMyTasksQuery,
    taken: useGetTakenTasksQuery,
    placed: useGetPlacedTasksQuery,
    all: useGetAllTasksQuery,
  }[tab]!({ page, search });

  const button = { my: createTaskButton }[tab];

  const actions = {
    main: [takeTaskAction],
    my: [completeTaskAction, deleteTaskAction],
    taken: [untakeTaskAction, executeTaskAction],
  }[tab];

  return (
    <TasksTable
      {...response}
      page={page}
      setPage={setPage}
      search={search}
      setSearch={setSearch}
      button={button}
      actions={actions}
    />
  );
}
