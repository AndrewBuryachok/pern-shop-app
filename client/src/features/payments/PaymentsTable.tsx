import { ITableWithActions } from '../../common/interfaces';
import { Payment } from './payment.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewPaymentAction } from './ViewPaymentModal';

type Props = ITableWithActions<Payment>;

export default function PaymentsTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={800}
      columns={['Sender', 'Receiver', 'Sum', 'Created', 'Action']}
      {...props}
    >
      {props.data?.result.map((payment) => (
        <tr key={payment.id}>
          <td>
            <AvatarWithDoubleText {...payment.senderCard} />
          </td>
          <td>
            <AvatarWithDoubleText {...payment.receiverCard} />
          </td>
          <td>
            <SumText
              myId={user.id}
              fromId={payment.senderCard.user.id}
              toId={payment.receiverCard.user.id}
              sum={payment.sum}
            />
          </td>
          <td>
            <DateText date={payment.createdAt} />
          </td>
          <td>
            <CustomActions
              data={payment}
              actions={[viewPaymentAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
