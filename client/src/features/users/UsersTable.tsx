import { ITableWithActions } from '../../common/interfaces';
import { User } from './user.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import RolesBadge from '../../common/components/RolesBadge';
import SingleText from '../../common/components/SingleText';
import PlaceText from '../../common/components/PlaceText';
import CustomSelect from '../../common/components/CustomSelect';
import CustomActions from '../../common/components/CustomActions';
import { viewUserAction } from './ViewUserModal';
import { viewCards } from '../../common/utils';

type Props = ITableWithActions<User>;

export default function UsersTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={['User', 'Roles', 'City', 'Cards', 'Action']}
      {...props}
    >
      {props.data?.result.map((user) => (
        <tr key={user.id}>
          <td>
            <AvatarWithSingleText id={user.id} name={user.name} />
          </td>
          <td>
            <RolesBadge roles={user.roles} />
          </td>
          <td>
            {user.city ? (
              <PlaceText
                name={user.city.name}
                x={user.city.x}
                y={user.city.y}
              />
            ) : (
              <SingleText text={'-'} />
            )}
          </td>
          <td>
            <CustomSelect label='Cards' data={viewCards(user.cards)} />
          </td>
          <td>
            <CustomActions data={user} actions={[viewUserAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
