import { ITableWithActions } from '../../common/interfaces';
import { Trade } from './trade.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import CustomPlaceWithAvatar from '../../common/components/CustomPlaceWithAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewTradeAction } from './ViewTradeModal';
import { parseTradeAmount } from '../../common/utils';

type Props = ITableWithActions<Trade>;

export default function TradesTable({ actions = [], ...props }: Props) {
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
        'Market',
        'Created',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((trade) => (
        <tr key={trade.id}>
          <td>
            <AvatarWithDoubleText {...trade.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...trade.ware.rent.card} />
          </td>
          <td>
            <ThingImageWithText {...trade.ware} />
          </td>
          <td>
            <SingleText text={parseTradeAmount(trade)} />
          </td>
          <td>
            <SumText
              myId={user.id}
              fromId={trade.card.user.id}
              toId={trade.ware.rent.card.user.id}
              sum={trade.amount * trade.ware.price}
            />
          </td>
          <td>
            <CustomPlaceWithAvatar
              {...trade.ware.rent.store.market}
              container={trade.ware.rent.store.name}
            />
          </td>
          <td>
            <DateText date={trade.createdAt} />
          </td>
          <td>
            <CustomActions
              data={trade}
              actions={[viewTradeAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
