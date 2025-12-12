import { ITableWithActions } from '../../common/interfaces';
import { Order } from './order.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadgeWithAvatar from '../../common/components/StatusBadgeWithAvatar';
import PlaceWithSingleAvatar from '../../common/components/PlaceWithSingleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewOrderAction } from './ViewOrderModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Order>;

export default function OrdersTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1200}
      columns={[
        'customer',
        'item',
        'amount',
        'price',
        'status',
        'station',
        'action',
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
            <PlaceWithSingleAvatar {...order.station} />
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
