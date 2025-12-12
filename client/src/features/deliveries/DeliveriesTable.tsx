import { ITableWithActions } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadgeWithAvatar from '../../common/components/StatusBadgeWithAvatar';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
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
        'price',
        'status',
        'place',
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
            <PriceText {...delivery} />
          </td>
          <td>
            <StatusBadgeWithAvatar {...delivery} />
          </td>
          <td>
            {delivery.purchase.good.shop && (
              <PlaceWithDoubleAvatar {...delivery.purchase.good.shop} />
            )}
            {delivery.purchase.good.rent && (
              <PlaceWithDoubleAvatar
                {...delivery.purchase.good.rent.stall.market}
                container={delivery.purchase.good.rent.stall.name}
              />
            )}
            {delivery.purchase.good.lease && (
              <PlaceWithDoubleAvatar
                {...delivery.purchase.good.lease.cell.storage}
                container={delivery.purchase.good.lease.cell.name}
              />
            )}
          </td>
          <td>
            <PlaceWithDoubleAvatar {...delivery.station} />
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
