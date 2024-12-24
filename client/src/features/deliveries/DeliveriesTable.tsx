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
import {
  parseBargainAmount,
  parseSaleAmount,
  parseTradeAmount,
} from '../../common/utils';

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
            {delivery.bargain && (
              <ThingImageWithText {...delivery.bargain.good} />
            )}
            {delivery.trade && <ThingImageWithText {...delivery.trade.ware} />}
            {delivery.sale && <ThingImageWithText {...delivery.sale.product} />}
          </td>
          <td>
            {delivery.bargain && (
              <SingleText text={parseBargainAmount(delivery.bargain)} />
            )}
            {delivery.trade && (
              <SingleText text={parseTradeAmount(delivery.trade)} />
            )}
            {delivery.sale && (
              <SingleText text={parseSaleAmount(delivery.sale)} />
            )}
          </td>
          <td>
            <PriceText {...delivery} />
          </td>
          <td>
            <StatusBadge {...delivery} />
          </td>
          <td>
            {delivery.bargain && (
              <PlaceWithDoubleAvatar {...delivery.bargain.good.shop} />
            )}
            {delivery.trade && (
              <PlaceWithDoubleAvatar
                {...delivery.trade.ware.rent.stall.market}
                container={delivery.trade.ware.rent.stall.name}
              />
            )}
            {delivery.sale && (
              <PlaceWithDoubleAvatar
                {...delivery.sale.product.lease.cell.storage}
                container={delivery.sale.product.lease.cell.name}
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
