import { ITableWithActions } from '../../common/interfaces';
import { Task } from './task.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import PriorityIconWithText from '../../common/components/PriorityIconWithText';
import StatusWithSingleAvatar from '../../common/components/StatusWithSingleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewTaskAction } from './ViewTaskModal';

type Props = ITableWithActions<Task>;

export default function TasksTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={900}
      columns={['customer', 'title', 'priority', 'status', 'action']}
      {...props}
    >
      {props.data?.result.map((task) => (
        <tr key={task.id}>
          <td>
            <AvatarWithSingleText {...task.customerUser} />
          </td>
          <td>
            <SingleText text={task.title} />
          </td>
          <td>
            <PriorityIconWithText {...task} />
          </td>
          <td>
            <StatusWithSingleAvatar {...task} />
          </td>
          <td>
            <CustomActions data={task} actions={[viewTaskAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
