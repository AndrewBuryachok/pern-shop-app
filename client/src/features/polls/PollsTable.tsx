import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import MyVoteBadge from '../../common/components/MyVoteBadge';
import CustomProgress from '../../common/components/CustomProgress';
import TotalText from '../../common/components/TotalText';
import ResultBadge from '../../common/components/ResultBadge';
import CustomActions from '../../common/components/CustomActions';
import { viewPollAction } from './ViewPollModal';

type Props = ITableWithActions<Poll>;

export default function PollsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

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
      {props.data?.result.map((poll) => (
        <tr key={poll.id}>
          <td>
            <AvatarWithSingleText {...poll.user} />
          </td>
          <td>
            <SingleText text={poll.title} />
          </td>
          <td>
            <MyVoteBadge {...poll} />
          </td>
          <td>
            <CustomProgress {...poll} />
          </td>
          <td>
            <TotalText data={poll.discussions.length} />
          </td>
          <td>
            <ResultBadge {...poll} />
          </td>
          <td>
            <CustomActions data={poll} actions={[viewPollAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
