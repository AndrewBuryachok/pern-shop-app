import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusWithDoubleAvatar from '../../common/components/StatusWithDoubleAvatar';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewDeliveryAction } from './ViewDeliveryModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Delivery>;

export default function DeliveriesTable({ actions = [], ...props }: Props) {
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
        t('columns.from'),
        t('columns.to'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((delivery) => (
        <tr key={delivery.id}>
          <td>
            <AvatarWithDoubleText {...delivery.fromLease.card} />
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
            <StatusWithDoubleAvatar {...delivery} />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...delivery.fromLease.cell.storage}
              container={delivery.fromLease.cell.name}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar
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
