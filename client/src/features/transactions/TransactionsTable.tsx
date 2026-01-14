import { ITableWithActions } from '../../common/interfaces';
import { Transaction } from './transaction.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import SumText from '../../common/components/SumText';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewTransactionAction } from './ViewTransactionModal';

type Props = ITableWithActions<Transaction>;

export default function TransactionsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={900}
      columns={[
        'sender',
        'receiver',
        'sum',
        'description',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((transaction) => (
        <tr key={transaction.id}>
          <td>
            <AvatarWithDoubleText {...transaction.senderCard} />
          </td>
          <td>
            <AvatarWithDoubleText {...transaction.receiverCard} />
          </td>
          <td>
            <SumText
              fromId={transaction.senderCard.user.id}
              toId={transaction.receiverCard.user.id}
              sum={transaction.sum}
            />
          </td>
          <td>
            <SingleText text={transaction.description || '-'} />
          </td>
          <td>
            <DateText date={transaction.createdAt} />
          </td>
          <td>
            <CustomActions
              data={transaction}
              actions={[viewTransactionAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
