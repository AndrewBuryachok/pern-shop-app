import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Friend } from './friend.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import ColorBadge from '../../common/components/ColorBadge';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewFriendAction } from './ViewFriendModal';
import { Color } from '../../common/constants';

type Props = ITableWithActions<Friend>;

export default function FriendsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={800}
      columns={[
        t('columns.sender'),
        t('columns.receiver'),
        t('columns.type'),
        t('columns.created'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((friend) => (
        <tr key={friend.id}>
          <td>
            <AvatarWithSingleText {...friend.senderUser} />
          </td>
          <td>
            <AvatarWithSingleText {...friend.receiverUser} />
          </td>
          <td>
            <ColorBadge color={friend.type ? Color.GREEN : Color.RED} />
          </td>
          <td>
            <DateText date={friend.createdAt} />
          </td>
          <td>
            <CustomActions
              data={friend}
              actions={[viewFriendAction, ...actions]}
            />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
