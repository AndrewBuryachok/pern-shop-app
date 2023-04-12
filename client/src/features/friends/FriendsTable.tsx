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
  return (
    <CustomTable
      minWidth={800}
      columns={['Sender', 'Receiver', 'Type', 'Created', 'Action']}
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
