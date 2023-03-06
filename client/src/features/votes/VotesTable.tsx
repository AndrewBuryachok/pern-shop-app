import { ITableWithActions } from '../../common/interfaces';
import { Vote } from './vote.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import ColorBadge from '../../common/components/ColorBadge';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewVoteAction } from './ViewVoteModal';

type Props = ITableWithActions<Vote>;

export default function VotesTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={['Voter', 'Poller', 'Description', 'Vote', 'Created', 'Action']}
      {...props}
    >
      {props.data?.result.map((vote) => (
        <tr key={vote.id}>
          <td>
            <AvatarWithSingleText id={vote.user.id} name={vote.user.name} />
          </td>
          <td>
            <AvatarWithSingleText
              id={vote.poll.user.id}
              name={vote.poll.user.name}
            />
          </td>
          <td>
            <SingleText text={vote.poll.description} />
          </td>
          <td>
            <ColorBadge color={vote.type ? 'green' : 'red'} />
          </td>
          <td>
            <DateText date={vote.createdAt} />
          </td>
          <td>
            <CustomActions data={vote} actions={[viewVoteAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
