import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import CustomBadge from '../../common/components/CustomBadge';
import CustomProgress from '../../common/components/CustomProgress';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewPollAction } from './ViewPollModal';
import { Color } from '../../common/constants';

type Props = ITableWithActions<Poll>;

export default function PollsTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        t('columns.poller'),
        t('columns.title'),
        t('columns.vote'),
        t('columns.results'),
        t('columns.completed'),
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
            <CustomBadge
              color={
                poll.myVote && (poll.myVote.type ? Color.GREEN : Color.RED)
              }
              text={
                poll.myVote &&
                (poll.myVote.type ? t('columns.up') : t('columns.down'))
              }
            />
          </td>
          <td>
            <CustomProgress {...poll} />
          </td>
          <td>
            <DateText date={poll.completedAt} />
          </td>
          <td>
            <CustomActions data={poll} actions={[viewPollAction, ...actions]} />
          </td>
        </tr>
      ))}
    </CustomTable>
  );
}
