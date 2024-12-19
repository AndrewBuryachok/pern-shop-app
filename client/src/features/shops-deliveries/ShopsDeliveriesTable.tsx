import { ITableWithActions } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadge from '../../common/components/StatusBadge';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewShopDeliveryAction } from './ViewShopDeliveryModal';
import { parseBargainAmount } from '../../common/utils';

type Props = ITableWithActions<ShopDelivery>;

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
        'fromShop',
        'toStation',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((shopDelivery) => (
        <tr key={shopDelivery.id}>
          <td>
            <AvatarWithDoubleText {...shopDelivery.hire.card} />
          </td>
          <td>
            <ThingImageWithText {...shopDelivery.bargain.good} />
          </td>
          <td>
            <SingleText text={parseBargainAmount(shopDelivery.bargain)} />
          </td>
          <td>
            <PriceText {...shopDelivery} />
          </td>
          <td>
            <StatusBadge {...shopDelivery} />
          </td>
          <td>
            <PlaceWithDoubleAvatar {...shopDelivery.bargain.good.shop} />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...shopDelivery.hire.box.station}
              container={shopDelivery.hire.box.name}
            />
          </td>
          <td>
            <CustomActions
              data={shopDelivery}
              actions={[viewShopDeliveryAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
