import { ITableWithActions } from '../../common/interfaces';
import { User } from './user.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import RolesBadge from '../../common/components/RolesBadge';
import SingleText from '../../common/components/SingleText';
import PlaceWithSingleAvatar from '../../common/components/PlaceWithSingleAvatar';
import DateText from '../../common/components/DateText';
import CustomRating from '../../common/components/CustomRating';
import CustomActions from '../../common/components/CustomActions';
import { viewUserAction } from './ViewUserModal';

type Props = ITableWithActions<User>;

export default function UsersTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1000}
      columns={['user', 'roles', 'city', 'online', 'rating', 'action']}
      {...props}
    >
      {props.data?.result.map((user) => (
        <tr key={user.id}>
          <td>
            <AvatarWithSingleText {...user} />
          </td>
          <td>
            <RolesBadge roles={user.roles} />
          </td>
          <td>
            {user.city ? (
              <PlaceWithSingleAvatar {...user.city} />
            ) : (
              <SingleText text='-' />
            )}
          </td>
          <td>
            <DateText date={user.onlineAt} />
          </td>
          <td>
            <CustomRating value={user.rating} />
          </td>
          <td>
            <CustomActions data={user} actions={[viewUserAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
