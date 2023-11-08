import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { User } from './user.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import RolesBadge from '../../common/components/RolesBadge';
import SingleText from '../../common/components/SingleText';
import DateText from '../../common/components/DateText';
import PlaceText from '../../common/components/PlaceText';
import TotalText from '../../common/components/TotalText';
import CustomActions from '../../common/components/CustomActions';
import { viewUserAction } from './ViewUserModal';

type Props = ITableWithActions<User>;

export default function UsersTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1100}
      columns={[
        t('columns.user'),
        t('columns.roles'),
        t('columns.owner'),
        t('columns.city'),
        t('columns.cards'),
        t('columns.registered'),
        t('columns.action'),
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
            {user.city?.user ? (
              <AvatarWithSingleText {...user.city.user} />
            ) : (
              <SingleText text='-' />
            )}
          </td>
          <td>
            {user.city ? <PlaceText {...user.city} /> : <SingleText text='-' />}
          </td>
          <td>
            <TotalText data={user.cards.length} />
          </td>
          <td>
            <DateText date={user.registeredAt} />
          </td>
          <td>
            <CustomActions data={user} actions={[viewUserAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
