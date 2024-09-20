import { ITableWithActions } from '../../common/interfaces';
import { Town } from './town.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import PlaceText from '../../common/components/PlaceText';
import CustomAnchor from '../../common/components/CustomAnchor';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewTownAction } from './ViewTownModal';
import { openViewTownUsersAction } from './ViewTownUsersModal';

type Props = ITableWithActions<Town>;

export default function TownsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={700}
      columns={['owner', 'town', 'users', 'created', 'action']}
      {...props}
    >
      {props.data?.result.map((town) => (
        <tr key={town.id}>
          <td>
            <AvatarWithSingleText {...town.user} />
          </td>
          <td>
            <PlaceText {...town} />
          </td>
          <td>
            <CustomAnchor
              text={`${town.users}`}
              open={() => openViewTownUsersAction(town)}
            />
          </td>
          <td>
            <DateText date={town.createdAt} />
          </td>
          <td>
            <CustomActions data={town} actions={[viewTownAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
