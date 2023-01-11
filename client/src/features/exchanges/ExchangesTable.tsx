import { ITableWithActions } from '../../common/interfaces';
import { Exchange } from './exchange.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewExchangeAction } from './ViewExchangeModal';
import { Color } from '../../common/constants';

type Props = ITableWithActions<Exchange>;

export default function ExchangesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={['Executor', 'Customer', 'Sum', 'Created', 'Action']}
      {...props}
    >
      {props.data?.result.map((exchange) => (
        <tr key={exchange.id}>
          <td>
            <AvatarWithSingleText
              id={exchange.executorUser.id}
              name={exchange.executorUser.name}
            />
          </td>
          <td>
            <AvatarWithDoubleText
              id={exchange.customerCard.user.id}
              name={exchange.customerCard.user.name}
              text={exchange.customerCard.name}
              color={exchange.customerCard.color}
            />
          </td>
          <td>
            <SingleText
              text={`${exchange.type ? '+' : '-'}${exchange.sum}$`}
              color={exchange.type ? Color.GREEN : Color.RED}
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
