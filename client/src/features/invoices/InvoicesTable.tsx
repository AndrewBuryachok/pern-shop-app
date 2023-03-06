import { ITableWithActions } from '../../common/interfaces';
import { Invoice } from './invoice.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import SingleText from '../../common/components/SingleText';
import CustomActions from '../../common/components/CustomActions';
import { viewInvoiceAction } from './ViewInvoiceModal';

type Props = ITableWithActions<Invoice>;

export default function InvoicesTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={800}
      columns={['Sender', 'Receiver', 'Sum', 'Completed', 'Action']}
      {...props}
    >
      {props.data?.result.map((invoice) => (
        <tr key={invoice.id}>
          <td>
            <AvatarWithDoubleText
              id={invoice.senderCard.user.id}
              name={invoice.senderCard.user.name}
              text={invoice.senderCard.name}
              color={invoice.senderCard.color}
            />
          </td>
          <td>
            {invoice.receiverCard ? (
              <AvatarWithDoubleText
                id={invoice.receiverCard.user.id}
                name={invoice.receiverCard.user.name}
                text={invoice.receiverCard.name}
                color={invoice.receiverCard.color}
              />
            ) : (
              <AvatarWithSingleText
                id={invoice.receiverUser.id}
                name={invoice.receiverUser.name}
              />
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
            {invoice.completedAt ? (
              <DateText date={invoice.completedAt} />
            ) : (
              <SingleText text={'-'} />
            )}
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
