import { ITableWithActions } from '../../common/interfaces';
import { User } from './user.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import RolesBadge from '../../common/components/RolesBadge';
import SingleText from '../../common/components/SingleText';
import PlaceWithSingleAvatar from '../../common/components/PlaceWithSingleAvatar';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewUserAction } from './ViewUserModal';

type Props = ITableWithActions<User> & {
  column: string;
  callback: (user: User) => number;
};

export default function UsersTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={1000}
      columns={[
        'user',
        'roles',
        'city',
        props.column,
        'online',
        'registered',
        'action',
      ]}
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
            <SingleText text={`${props.callback(user)}`} />
          </td>
          <td>
            <DateText date={user.onlineAt} />
          </td>
          <td>
            <DateText date={user.createdAt} />
          </td>
          <td>
            <CustomActions data={user} actions={[viewUserAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
