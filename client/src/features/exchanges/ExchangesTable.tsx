import { ITableWithActions } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import ColorBadge from '../../common/components/ColorBadge';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewExchangeAction } from './ViewExchangeModal';
import { Color } from '../../common/constants';

type Props = ITableWithActions<Exchange>;

export default function ExchangesTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={800}
      columns={['Executor', 'Customer', 'Type', 'Sum', 'Created', 'Action']}
      {...props}
    >
      {props.data?.result.map((exchange) => (
        <tr key={exchange.id}>
          <td>
            <AvatarWithSingleText {...exchange.executorUser} />
          </td>
          <td>
            <AvatarWithDoubleText {...exchange.customerCard} />
          </td>
          <td>
            <ColorBadge color={exchange.type ? Color.GREEN : Color.RED} />
          </td>
          <td>
            <SumText
              myId={user.id}
              fromId={exchange.type ? 0 : exchange.customerCard.user.id}
              toId={!exchange.type ? 0 : exchange.customerCard.user.id}
              sum={exchange.sum}
            />
          </td>
          <td>
            <DateText date={exchange.createdAt} />
          </td>
          <td>
            <CustomActions
              data={exchange}
              actions={[viewExchangeAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
