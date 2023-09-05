import { ITableWithActions } from '../../common/interfaces';
import { Task } from './task.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import PriorityIconWithText from '../../common/components/PriorityIconWithText';
import ColorBadge from '../../common/components/ColorBadge';
import CustomActions from '../../common/components/CustomActions';
import { viewTaskAction } from './ViewTaskModal';

type Props = ITableWithActions<Task>;

export default function TasksTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'Customer',
        'Description',
        'Priority',
        'Executor',
        'Status',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((task) => (
        <tr key={task.id}>
          <td>
            <AvatarWithSingleText {...task.customerUser} />
          </td>
          <td>
            <SingleText text={task.description} />
          </td>
          <td>
            <PriorityIconWithText {...task} />
          </td>
          <td>
            {task.executorUser ? (
              <AvatarWithSingleText {...task.executorUser} />
            ) : (
              <SingleText text='-' />
            )}
          </td>
          <td>
            <ColorBadge color={task.status} />
          </td>
          <td>
            <CustomActions data={task} actions={[viewTaskAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}