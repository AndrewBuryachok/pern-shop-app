import { ITableWithActions } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadge from '../../common/components/StatusBadge';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewMarketDeliveryAction } from './ViewMarketDeliveryModal';
import { parseTradeAmount } from '../../common/utils';

type Props = ITableWithActions<MarketDelivery>;

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
        'fromMarket',
        'toStation',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((marketDelivery) => (
        <tr key={marketDelivery.id}>
          <td>
            <AvatarWithDoubleText {...marketDelivery.hire.card} />
          </td>
          <td>
            <ThingImageWithText {...marketDelivery.trade.ware} />
          </td>
          <td>
            <SingleText text={parseTradeAmount(marketDelivery.trade)} />
          </td>
          <td>
            <PriceText {...marketDelivery} />
          </td>
          <td>
            <StatusBadge {...marketDelivery} />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...marketDelivery.trade.ware.rent.store.market}
              container={marketDelivery.trade.ware.rent.store.name}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...marketDelivery.hire.drawer.station}
              container={marketDelivery.hire.drawer.name}
            />
          </td>
          <td>
            <CustomActions
              data={marketDelivery}
              actions={[viewMarketDeliveryAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
