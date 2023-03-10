import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import ColorBadge from '../../common/components/ColorBadge';
import CustomProgress from '../../common/components/CustomProgress';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewPollAction } from './ViewPollModal';

type Props = ITableWithActions<Poll>;

export default function PollsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={[
        'Poller',
        'Description',
        'Vote',
        'Results',
        'Completed',
        'Action',
      ]}
      {...props}
    >
      {props.data?.result.map((poll) => (
        <tr key={poll.id}>
          <td>
            <AvatarWithSingleText id={poll.user.id} name={poll.user.name} />
          </td>
          <td>
            <SingleText text={poll.description} />
          </td>
          <td>
            <ColorBadge
              color={
                poll.myVote ? (poll.myVote.type ? 'green' : 'red') : 'gray'
              }
            />
          </td>
          <td>
            <CustomProgress {...poll} />
          </td>
          <td>
            {poll.completedAt ? (
              <DateText date={poll.completedAt} />
            ) : (
              <SingleText text={'-'} />
            )}
          </td>
          <td>
            <CustomActions data={poll} actions={[viewPollAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
