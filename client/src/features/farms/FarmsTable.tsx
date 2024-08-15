import { ITableWithActions } from '../../common/interfaces';
import { Farm } from './farm.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewFarmAction } from './ViewFarmModal';
import { openViewFarmUsersAction } from './ViewFarmUsersModal';

type Props = ITableWithActions<Farm>;

export default function FarmsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'farm', 'users', 'created', 'action']}
      {...props}
    >
      {props.data?.result.map((farm) => (
        <tr key={farm.id}>
          <td>
            <AvatarWithSingleText {...farm.user} />
          </td>
          <td>
            <PlaceText {...farm} />
          </td>
          <td>
            <CustomAnchor
              text={`${farm.users}`}
              open={() => openViewFarmUsersAction(farm)}
            />
          </td>
          <td>
            <DateText date={farm.createdAt} />
          </td>
          <td>
            <CustomActions data={farm} actions={[viewFarmAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
