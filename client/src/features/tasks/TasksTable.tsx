import { ITableWithActions } from '../../common/interfaces';
import { Task } from './task.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadge from '../../common/components/StatusBadge';
import CustomActions from '../../common/components/CustomActions';
import { viewTaskAction } from './ViewTaskModal';

type Props = ITableWithActions<Task>;

export default function TasksTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={['customer', 'description', 'price', 'status', 'action']}
      {...props}
    >
      {props.data?.result.map((task) => (
        <tr key={task.id}>
          <td>
            <AvatarWithDoubleText {...task.customerCard} />
          </td>
          <td>
            <SingleText text={task.description || '-'} />
          </td>
          <td>
            <PriceText {...task} />
          </td>
          <td>
            <StatusBadge {...task} />
          </td>
          <td>
            <CustomActions data={task} actions={[viewTaskAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
