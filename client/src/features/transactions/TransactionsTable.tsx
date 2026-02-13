import { Group } from '@mantine/core';
import { ITableWithActions } from '../../common/interfaces';
import { Transaction } from './transaction.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SumText from '../../common/components/SumText';
import ThingImage from '../../common/components/ThingImage';
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
            {transaction.senderCard ? (
              <AvatarWithDoubleText {...transaction.senderCard} />
            ) : (
              <AvatarWithSingleText {...transaction.executorUser!} />
            )}
          </td>
          <td>
            {transaction.receiverCard ? (
              <AvatarWithDoubleText {...transaction.receiverCard} />
            ) : (
              <AvatarWithSingleText {...transaction.executorUser!} />
            )}
          </td>
          <td>
            <SumText
              fromId={transaction.senderCard?.user.id || 0}
              toId={transaction.receiverCard?.user.id || 0}
              sum={transaction.sum}
            />
          </td>
          <td>
            <Group spacing={8}>
              {transaction.item && <ThingImage item={transaction.item} />}
              <SingleText text={transaction.description || '-'} />
            </Group>
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
