import { ITableWithActions } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import StatusBadgeWithAvatar from '../../common/components/StatusBadgeWithAvatar';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import PlaceWithSingleAvatar from '../../common/components/PlaceWithSingleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewDeliveryAction } from './ViewDeliveryModal';
import { parsePurchaseAmount } from '../../common/utils';

type Props = ITableWithActions<Delivery>;

export default function DeliveriesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1200}
      columns={[
        'customer',
        'item',
        'amount',
        'sum',
        'status',
        'shop',
        'station',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((delivery) => (
        <tr key={delivery.id}>
          <td>
            <AvatarWithDoubleText {...delivery.customerCard} />
          </td>
          <td>
            <ThingImageWithText {...delivery.purchase.good} />
          </td>
          <td>
            <SingleText text={parsePurchaseAmount(delivery.purchase)} />
          </td>
          <td>
            <SumText
              fromId={delivery.customerCard.id}
              toId={delivery.executorCard?.user.id || 0}
              sum={delivery.sum}
            />
          </td>
          <td>
            <StatusBadgeWithAvatar {...delivery} />
          </td>
          <td>
            <PlaceWithDoubleAvatar {...delivery.purchase.good.shop} />
          </td>
          <td>
            <PlaceWithSingleAvatar {...delivery.station} />
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
