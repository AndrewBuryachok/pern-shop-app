import { ITableWithActions } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadge from '../../common/components/StatusBadge';
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
        'toStation',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((delivery) => (
        <tr key={delivery.id}>
          <td>
            <AvatarWithDoubleText {...delivery.hire.card} />
          </td>
          <td>
            {delivery.purchase.good && (
              <ThingImageWithText {...delivery.purchase.good} />
            )}
            {delivery.purchase.ware && (
              <ThingImageWithText {...delivery.purchase.ware} />
            )}
            {delivery.purchase.product && (
              <ThingImageWithText {...delivery.purchase.product} />
            )}
          </td>
          <td>
            <SingleText text={parsePurchaseAmount(delivery.purchase)} />
          </td>
          <td>
            <PriceText {...delivery} />
          </td>
          <td>
            <StatusBadge {...delivery} />
          </td>
          <td>
            {delivery.purchase.good && (
              <PlaceWithDoubleAvatar {...delivery.purchase.good.shop} />
            )}
            {delivery.purchase.ware && (
              <PlaceWithDoubleAvatar
                {...delivery.purchase.ware.rent.stall.market}
                container={delivery.purchase.ware.rent.stall.name}
              />
            )}
            {delivery.purchase.product && (
              <PlaceWithDoubleAvatar
                {...delivery.purchase.product.lease.cell.storage}
                container={delivery.purchase.product.lease.cell.name}
              />
            )}
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...delivery.hire.box.station}
              container={delivery.hire.box.name}
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
