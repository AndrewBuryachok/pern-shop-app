import { ITableWithActions } from '../../common/interfaces';
import { Order } from './order.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadgeWithAvatar from '../../common/components/StatusBadgeWithAvatar';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewOrderAction } from './ViewOrderModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Order>;

export default function OrdersTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1200}
      columns={[
        'Customer',
        'Item',
        'Amount',
        'Price',
        'Status',
        'Storage',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((order) => (
        <tr key={order.id}>
          <td>
            <AvatarWithDoubleText {...order.customerCard} />
          </td>
          <td>
            <ThingImageWithText {...order} />
          </td>
          <td>
            <SingleText text={parseThingAmount(order)} />
          </td>
          <td>
            <PriceText {...order} />
          </td>
          <td>
            <StatusBadgeWithAvatar {...order} />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...order.cell.storage}
              container={order.cell.name}
            />
          </td>
          <td>
            <CustomActions
              data={order}
              actions={[viewOrderAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
