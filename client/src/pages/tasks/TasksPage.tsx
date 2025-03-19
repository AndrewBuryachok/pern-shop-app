import { useLocation, useSearchParams } from 'react-router-dom';
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
  editMyTaskAction,
  editUserTaskAction,
} from '../../features/tasks/EditTaskModal';
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

  const search = {
    page: +(searchParams.get('page') || 1),
    id: +(searchParams.get('id') || 0) || null,
    user: searchParams.get('user'),
    card: searchParams.get('card'),
    modes: [Mode.CUSTOMER, Mode.EXECUTOR],
    mode: searchParams.get('mode') as Mode,
    activity: searchParams.get('activity') || '',
    minPrice: +(searchParams.get('minPrice') || 0) || null,
    maxPrice: +(searchParams.get('maxPrice') || 0) || null,
    status: searchParams.get('status'),
    rate: +(searchParams.get('rate') || 0) || null,
    minDate: searchParams.get('minDate'),
    maxDate: searchParams.get('maxDate'),
    completed: searchParams.get('completed'),
  };

  const response = {
    main: useGetMainTasksQuery,
    my: useGetMyTasksQuery,
    taken: useGetTakenTasksQuery,
    all: useGetAllTasksQuery,
  }[tab]!(search);

  const button = {
    main: createMyTaskButton,
    my: createMyTaskButton,
    all: createUserTaskButton,
  }[tab];

  const actions = {
    main: [takeMyTaskAction],
    my: [editMyTaskAction, completeTaskAction, deleteTaskAction],
    taken: [executeTaskAction, untakeTaskAction],
    all: [
      editUserTaskAction,
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
      search={search}
      button={button}
      actions={actions}
    />
  );
}
