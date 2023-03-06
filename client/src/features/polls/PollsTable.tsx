import { Progress } from '@mantine/core';
import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import CustomProgress from '../../common/components/CustomProgress';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewPollAction } from './ViewPollModal';

type Props = ITableWithActions<Poll>;

export default function PollsTable({ actions = [], ...props }: Props) {
  return (
    <CustomTable
      minWidth={800}
      columns={['Poller', 'Description', 'Results', 'Created', 'Action']}
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
            <CustomProgress {...poll} />
          </td>
          <td>
            <DateText date={poll.createdAt} />
          </td>
          <td>
            <CustomActions data={poll} actions={[viewPollAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
