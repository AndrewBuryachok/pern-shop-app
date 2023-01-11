import { ITableWithActions } from '../../common/interfaces';
import { Lease } from './lease.model';
import { getCurrentUser } from '../auth/auth.slice';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import CustomSelect from '../../common/components/CustomSelect';
import CustomActions from '../../common/components/CustomActions';
import { viewLeaseAction } from './ViewLeaseModal';
import { viewThings } from '../../common/utils';

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
        'Wared',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((lease) => (
        <tr key={lease.id}>
          <td>
            <AvatarWithDoubleText
              id={lease.card.user.id}
              name={lease.card.user.name}
              text={lease.card.name}
              color={lease.card.color}
            />
          </td>
          <td>
            <AvatarWithDoubleText
              id={lease.cell.storage.card.user.id}
              name={lease.cell.storage.card.user.name}
              text={lease.cell.storage.card.name}
              color={lease.cell.storage.card.color}
            />
          </td>
          <td>
            <PlaceText
              name={lease.cell.storage.name}
              x={lease.cell.storage.x}
              y={lease.cell.storage.y}
              container={lease.cell.name}
            />
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
            <CustomSelect label='Products' data={viewThings(lease.products)} />
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
