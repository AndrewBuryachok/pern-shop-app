import { ITableWithActions } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import TypeBadge from '../../common/components/TypeBadge';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewExchangeAction } from './ViewExchangeModal';

type Props = ITableWithActions<Exchange>;

export default function ExchangesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={['executor', 'customer', 'type', 'sum', 'created', 'action']}
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
            <TypeBadge type={exchange.type} />
          </td>
          <td>
            <SumText
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
