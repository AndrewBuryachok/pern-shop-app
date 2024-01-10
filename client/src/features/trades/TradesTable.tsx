import { ITableWithActions } from '../../common/interfaces';
import { Trade } from './trade.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ThingImageWithText from '../../common/components/ThingImageWithText';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import PlaceWithDoubleAvatar from '../../common/components/PlaceWithDoubleAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewTradeAction } from './ViewTradeModal';
import { parseTradeAmount } from '../../common/utils';

type Props = ITableWithActions<Trade>;

export default function TradesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1100}
      columns={[
        'buyer',
        'seller',
        'item',
        'amount',
        'sum',
        'market',
        'created',
        'action',
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
              fromId={trade.card.user.id}
              toId={trade.ware.rent.card.user.id}
              sum={trade.amount * trade.ware.price}
            />
          </td>
          <td>
            <PlaceWithDoubleAvatar
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
