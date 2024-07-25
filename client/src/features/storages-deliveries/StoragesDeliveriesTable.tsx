import { ITableWithActions } from '../../common/interfaces';
import { StorageDelivery } from './storage-delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusWithDoubleAvatar from '../../common/components/StatusWithDoubleAvatar';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewStorageDeliveryAction } from './ViewStorageDeliveryModal';
import { parseSaleAmount } from '../../common/utils';

type Props = ITableWithActions<StorageDelivery>;

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
        'fromStorage',
        'toStation',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((storageDelivery) => (
        <tr key={storageDelivery.id}>
          <td>
            <AvatarWithDoubleText {...storageDelivery.hire.card} />
          </td>
          <td>
            <ThingImageWithText {...storageDelivery.sale.product} />
          </td>
          <td>
            <SingleText text={parseSaleAmount(storageDelivery.sale)} />
          </td>
          <td>
            <PriceText {...storageDelivery} />
          </td>
          <td>
            <StatusWithDoubleAvatar {...storageDelivery} />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...storageDelivery.sale.product.lease.cell.storage}
              container={storageDelivery.sale.product.lease.cell.name}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...storageDelivery.hire.drawer.station}
              container={storageDelivery.hire.drawer.name}
            />
          </td>
          <td>
            <CustomActions
              data={storageDelivery}
              actions={[viewStorageDeliveryAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
