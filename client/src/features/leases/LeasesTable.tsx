import { ITableWithActions } from '../../common/interfaces';
import { Lease } from './lease.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewLeaseAction } from './ViewLeaseModal';

type Props = ITableWithActions<Lease>;

export default function LeasesTable({ actions = [], ...props }: Props) {
  const user = getCurrentUser()!;

  return (
    <CustomTable
      minWidth={800}
      columns={[
        'Renter',
        'Lessor',
        'Storage',
        'Sum',
        'Created',
        'Products',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((lease) => (
        <tr key={lease.id}>
          <td>
            <AvatarWithDoubleText {...lease.card} />
          </td>
          <td>
            <AvatarWithDoubleText {...lease.cell.storage.card} />
          </td>
          <td>
            <PlaceText {...lease.cell.storage} container={lease.cell.name} />
          </td>
          <td>
            <SumText
              myId={user.id}
              fromId={lease.card.user.id}
              toId={lease.cell.storage.card.user.id}
              sum={lease.cell.storage.price}
            />
          </td>
          <td>
            <DateText date={lease.createdAt} />
          </td>
          <td>
            <TotalText data={lease.products.length} />
          </td>
          <td>
            <CustomActions
              data={lease}
              actions={[viewLeaseAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
