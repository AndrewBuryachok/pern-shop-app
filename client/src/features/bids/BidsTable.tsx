import { ITableWithActions } from '../../common/interfaces';
import { Bid } from './bid.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewBidAction } from './ViewBidModal';
import { parseThingAmount } from '../../common/utils';

type Props = ITableWithActions<Bid>;

export default function BidsTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={1100}
      columns={[
        'Buyer',
        'Seller',
        'Item',
        'Amount',
        'Sum',
        'Storage',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((bid) => (
        <tr key={bid.id}>
          <td>
            <AvatarWithDoubleText {...bid.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...bid.lot.lease.card} />
          </td>
          <td>
            <ThingImageWithText {...bid.lot} />
          </td>
          <td>
            <SingleText text={parseThingAmount(bid.lot)} />
          </td>
          <td>
            <SumText
              myId={user.id}
              fromId={bid.card.user.id}
              toId={bid.lot.lease.card.user.id}
              sum={bid.price}
            />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...bid.lot.lease.cell.storage}
              container={bid.lot.lease.cell.name}
            />
          </td>
          <td>
            <DateText date={bid.createdAt} />
          </td>
          <td>
            <CustomActions data={bid} actions={[viewBidAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
