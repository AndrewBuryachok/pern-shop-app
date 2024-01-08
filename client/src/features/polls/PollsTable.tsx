import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useSelectVotedPollsQuery } from './polls.api';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import VoteBadge from '../../common/components/VoteBadge';
import CustomBadge from '../../common/components/CustomBadge';
import CustomProgress from '../../common/components/CustomProgress';
import TotalText from '../../common/components/TotalText';
import ResultBadge from '../../common/components/ResultBadge';
import CustomActions from '../../common/components/CustomActions';
import { viewPollAction } from './ViewPollModal';

type Props = ITableWithActions<Poll>;

export default function PollsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const { data: votedPolls } = useSelectVotedPollsQuery(undefined, {
    skip: !user,
  });

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        t('columns.owner'),
        t('columns.title'),
        t('columns.vote'),
        t('columns.votes'),
        t('columns.discussions'),
        t('columns.result'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result
        .map((poll) => ({
          ...poll,
          voted: votedPolls?.find((votedPoll) => votedPoll.id === poll.id),
        }))
        .map((poll) => (
          <tr key={poll.id}>
            <td>
              <AvatarWithSingleText {...poll.user} />
            </td>
            <td>
              <SingleText text={poll.title} />
            </td>
            <td>
              {poll.voted ? (
                <VoteBadge {...poll.voted.vote} />
              ) : (
                <CustomBadge />
              )}
            </td>
            <td>
              <CustomProgress {...poll} />
            </td>
            <td>
              <TotalText data={poll.discussions} />
            </td>
            <td>
              <ResultBadge {...poll} />
            </td>
            <td>
              <CustomActions
                data={poll}
                actions={[viewPollAction, ...actions]}
              />
            </td>
          </tr>
        ))}
    </CustomTable>
  );
}
