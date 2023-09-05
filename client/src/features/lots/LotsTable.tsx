import { ITableWithActions } from '../../common/interfaces';
import { Lot } from './lot.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import PriceText from '../../common/components/PriceText';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewLotAction } from './ViewLotModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Lot>;

export default function LotsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'Seller',
        'Item',
        'Amount',
        'Price',
        'Storage',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((lot) => (
        <tr key={lot.id}>
          <td>
            <AvatarWithDoubleText {...lot.lease.card} />
          </td>
          <td>
            <ThingImageWithText {...lot} />
          </td>
          <td>
            <SingleText text={parseThingAmount(lot)} />
          </td>
          <td>
            <PriceText {...lot} />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...lot.lease.cell.storage}
              container={lot.lease.cell.name}
            />
          </td>
          <td>
            <DateText date={lot.createdAt} />
          </td>
          <td>
            <CustomActions data={lot} actions={[viewLotAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
