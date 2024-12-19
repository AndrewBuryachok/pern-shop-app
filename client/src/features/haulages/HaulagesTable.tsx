import { ITableWithActions } from '../../common/interfaces';
import { Haulage } from './haulage.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import StatusBadge from '../../common/components/StatusBadge';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import CustomActions from '../../common/components/CustomActions';
import { viewHaulageAction } from './ViewHaulageModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Haulage>;

export default function HaulagesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1200}
      columns={[
        'customer',
        'item',
        'amount',
        'price',
        'status',
        'fromStation',
        'toStation',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((haulage) => (
        <tr key={haulage.id}>
          <td>
            <AvatarWithDoubleText {...haulage.fromHire.card} />
          </td>
          <td>
            <ThingImageWithText {...haulage} />
          </td>
          <td>
            <SingleText text={parseThingAmount(haulage)} />
          </td>
          <td>
            <PriceText {...haulage} />
          </td>
          <td>
            <StatusBadge {...haulage} />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...haulage.fromHire.box.station}
              container={haulage.fromHire.box.name}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar
              {...haulage.toHire.box.station}
              container={haulage.toHire.box.name}
            />
          </td>
          <td>
            <CustomActions
              data={haulage}
              actions={[viewHaulageAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
