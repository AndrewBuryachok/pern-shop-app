import { ITableWithActions } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SumText from '../../common/components/SumText';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewInvoiceAction } from './ViewInvoiceModal';

type Props = ITableWithActions<Invoice>;

export default function InvoicesTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'Sender',
        'Receiver',
        'Sum',
        'Description',
        'Completed',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((invoice) => (
        <tr key={invoice.id}>
          <td>
            <AvatarWithDoubleText {...invoice.senderCard} />
          </td>
          <td>
            {invoice.receiverCard ? (
              <AvatarWithDoubleText {...invoice.receiverCard} />
            ) : (
              <AvatarWithSingleText {...invoice.receiverUser} />
            )}
          </td>
          <td>
            <SumText
              myId={user.id}
              fromId={invoice.receiverUser.id}
              toId={invoice.senderCard.user.id}
              sum={invoice.sum}
            />
          </td>
          <td>
            <SingleText text={invoice.description} />
          </td>
          <td>
            <DateText date={invoice.completedAt} />
          </td>
          <td>
            <CustomActions
              data={invoice}
              actions={[viewInvoiceAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
