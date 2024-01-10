import { ITableWithActions } from '../../common/interfaces';
import { Payment } from './payment.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import SumText from '../../common/components/SumText';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewPaymentAction } from './ViewPaymentModal';

type Props = ITableWithActions<Payment>;

export default function PaymentsTable({ actions = [], ...props }: Props) {
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
              fromId={payment.senderCard.user.id}
              toId={payment.receiverCard.user.id}
              sum={payment.sum}
            />
          </td>
          <td>
            <SingleText text={payment.description || '-'} />
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
