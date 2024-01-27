import { ITableWithActions } from '../../common/interfaces';
import { Lease } from './lease.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import DateText from '../../common/components/DateText';
import SingleText from '../../common/components/SingleText';
import CustomActions from '../../common/components/CustomActions';
import { viewLeaseAction } from './ViewLeaseModal';
import { parseKind } from '../../common/utils';

type Props = ITableWithActions<Lease>;

export default function LeasesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={900}
      columns={[
        'renter',
        'owner',
        'storage',
        'sum',
        'completed',
        'kind',
        'action',
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
              fromId={lease.card.user.id}
              toId={lease.cell.storage.card.user.id}
              sum={lease.cell.storage.price}
            />
          </td>
          <td>
            <DateText date={lease.completedAt} />
          </td>
          <td>
            <SingleText text={parseKind(lease.kind)} />
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
