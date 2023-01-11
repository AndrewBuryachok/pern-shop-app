import { ITableWithActions } from '../../common/interfaces';
import { Trade } from './trade.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ItemImage from '../../common/components/ItemImage';
import SingleText from '../../common/components/SingleText';
import SumText from '../../common/components/SumText';
import PlaceText from '../../common/components/PlaceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewTradeAction } from './ViewTradeModal';
import { parseTradeAmount } from '../../common/utils';

type Props = ITableWithActions<Trade>;

export default function TradesTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={1000}
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
      {props.data?.result.map((trade) => (
        <tr key={trade.id}>
          <td>
            <AvatarWithDoubleText
              id={trade.card.user.id}
              name={trade.card.user.name}
              text={trade.card.name}
              color={trade.card.color}
            />
          </td>
          <td>
            <AvatarWithDoubleText
              id={trade.ware.rent.card.user.id}
              name={trade.ware.rent.card.user.name}
              text={trade.ware.rent.card.name}
              color={trade.ware.rent.card.color}
            />
          </td>
          <td>
            <ItemImage
              item={trade.ware.item}
              description={trade.ware.description}
            />
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
            <PlaceText
              name={trade.ware.rent.store.market.name}
              x={trade.ware.rent.store.market.x}
              y={trade.ware.rent.store.market.y}
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
