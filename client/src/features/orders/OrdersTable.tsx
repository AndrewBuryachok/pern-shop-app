import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Order } from './order.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusWithDoubleAvatar from '../../common/components/StatusWithDoubleAvatar';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewOrderAction } from './ViewOrderModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Order>;

export default function OrdersTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1200}
      columns={[
        t('columns.customer'),
        t('columns.item'),
        t('columns.amount'),
        t('columns.price'),
        t('columns.status'),
        t('columns.storage'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((order) => (
        <tr key={order.id}>
          <td>
            <AvatarWithDoubleText {...order.lease.card} />
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
            <StatusWithDoubleAvatar {...order} />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...order.lease.cell.storage}
              container={order.lease.cell.name}
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
