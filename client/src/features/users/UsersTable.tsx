import { useLocation } from 'react-router-dom';
import { ITableWithActions } from '../../common/interfaces';
import { User } from './user.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import BannedBadge from '../../common/components/BannedBadge';
import RolesBadge from '../../common/components/RolesBadge';
import SingleText from '../../common/components/SingleText';
import PlaceWithSingleAvatar from '../../common/components/PlaceWithSingleAvatar';
import PriceText from '../../common/components/PriceText';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewUserAction } from './ViewUserModal';
import { ROWS_PER_PAGE } from '../../common/constants';

type Props = ITableWithActions<User>;

export default function UsersTable({ actions = [], ...props }: Props) {
  const top = useLocation().pathname.split('/')[2] === 'top';

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        ...(top ? ['top'] : []),
        'user',
        'roles',
        'town',
        ...(top ? ['balance'] : []),
        'online',
        'created',
        'action',
      ]}
      {...props}
    >
      {props.data?.result.map((user, index) => (
        <tr key={user.id}>
          {top && (
            <td>
              <SingleText
                text={`${(props.search.page - 1) * ROWS_PER_PAGE + index + 1}`}
              />
            </td>
          )}
          <td>
            <AvatarWithSingleText {...user} />
          </td>
          <td>
            {user.banned ? <BannedBadge /> : <RolesBadge roles={user.roles} />}
          </td>
          <td>
            {user.town ? (
              <PlaceWithSingleAvatar {...user.town} />
            ) : (
              <SingleText text='-' />
            )}
          </td>
          {top && (
            <td>
              <PriceText price={user.balance!} />
            </td>
          )}
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
