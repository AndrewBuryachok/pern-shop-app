import { ITableWithActions } from '../../common/interfaces';
import { Lease } from './lease.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithDoubleText from '../../common/components/AvatarWithDoubleText';
import PlaceText from '../../common/components/PlaceText';
import SumText from '../../common/components/SumText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewLeaseAction } from './ViewLeaseModal';
import { openViewLeaseThingsAction } from './ViewLeaseThingsModal';
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
        'kind',
        'completed',
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
            <CustomAnchor
              text={parseKind(lease.kind)}
              open={() => openViewLeaseThingsAction(lease)}
            />
          </td>
          <td>
            <DateText date={lease.completedAt} />
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
