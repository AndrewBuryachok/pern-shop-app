import { ITableWithActions } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadgeWithAvatar from '../../common/components/StatusBadgeWithAvatar';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewDeliveryAction } from './ViewDeliveryModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Delivery>;

export default function DeliveriesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1200}
      columns={[
        'Sender',
        'Receiver',
        'Item',
        'Amount',
        'Price',
        'Status',
        'From',
        'To',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((delivery) => (
        <tr key={delivery.id}>
          <td>
            <AvatarWithDoubleText {...delivery.fromLease.card} />
          </td>
          <td>
            <AvatarWithSingleText {...delivery.receiverUser} />
          </td>
          <td>
            <ThingImageWithText {...delivery} />
          </td>
          <td>
            <SingleText text={parseThingAmount(delivery)} />
          </td>
          <td>
            <PriceText {...delivery} />
          </td>
          <td>
            <StatusBadgeWithAvatar {...delivery} />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...delivery.fromLease.cell.storage}
              container={delivery.fromLease.cell.name}
            />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...delivery.toLease.cell.storage}
              container={delivery.toLease.cell.name}
            />
          </td>
          <td>
            <CustomActions
              data={delivery}
              actions={[viewDeliveryAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
