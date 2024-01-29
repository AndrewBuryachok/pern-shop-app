import { ITableWithActions } from '../../common/interfaces';
import { Task } from './task.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusWithSingleAvatar from '../../common/components/StatusWithSingleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewTaskAction } from './ViewTaskModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Task>;

export default function TasksTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={900}
      columns={['customer', 'item', 'amount', 'price', 'status', 'action']}
      {...props}
    >
      {props.data?.result.map((task) => (
        <tr key={task.id}>
          <td>
            <AvatarWithSingleText {...task.customerUser} />
          </td>
          <td>
            <ThingImageWithText {...task} />
          </td>
          <td>
            <SingleText text={parseThingAmount(task)} />
          </td>
          <td>
            <PriceText {...task} />
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
