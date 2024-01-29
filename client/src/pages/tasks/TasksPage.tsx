import { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ISearch } from '../../common/interfaces';
import { Mode } from '../../common/enums';
import {
  useGetAllTasksQuery,
  useGetMainTasksQuery,
  useGetMyTasksQuery,
  useGetTakenTasksQuery,
} from '../../features/tasks/tasks.api';
import TasksTable from '../../features/tasks/TasksTable';
import {
  createMyTaskButton,
  createUserTaskButton,
} from '../../features/tasks/CreateTaskModal';
import {
  takeMyTaskAction,
  takeUserTaskAction,
} from '../../features/tasks/TakeTaskModal';
import { executeTaskAction } from '../../features/tasks/ExecuteTaskModal';
import { completeTaskAction } from '../../features/tasks/CompleteTaskModal';
import { untakeTaskAction } from '../../features/tasks/UntakeTaskModal';
import { deleteTaskAction } from '../../features/tasks/DeleteTaskModal';

export default function TasksPage() {
  const tab = useLocation().pathname.split('/')[2] || 'main';

  const [searchParams] = useSearchParams();

  const [page, setPage] = useState(+(searchParams.get('page') || 1));

  const [search, setSearch] = useState<ISearch>({
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR],
    mode: searchParams.get('mode') as Mode,
    item: searchParams.get('item'),
    description: searchParams.get('description') || '',
    minAmount: +(searchParams.get('minAmount') || 0) || null,
    maxAmount: +(searchParams.get('maxAmount') || 0) || null,
    minIntake: +(searchParams.get('minIntake') || 0) || null,
    maxIntake: +(searchParams.get('maxIntake') || 0) || null,
    kit: searchParams.get('kit'),
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    status: searchParams.get('status'),
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
  });

  const response = {
    main: useGetMainTasksQuery,
    my: useGetMyTasksQuery,
    taken: useGetTakenTasksQuery,
    all: useGetAllTasksQuery,
  }[tab]!({ page, search });

  const button = {
    main: createMyTaskButton,
    my: createMyTaskButton,
    all: createUserTaskButton,
  }[tab];

  const actions = {
    main: [takeMyTaskAction],
    my: [completeTaskAction, deleteTaskAction],
    taken: [untakeTaskAction, executeTaskAction],
    all: [
      takeUserTaskAction,
      executeTaskAction,
      completeTaskAction,
      untakeTaskAction,
      deleteTaskAction,
    ],
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
