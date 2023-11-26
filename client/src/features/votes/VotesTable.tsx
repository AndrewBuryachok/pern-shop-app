import { useTranslation } from 'react-i18next';
import { ITableWithActions } from '../../common/interfaces';
import { Vote } from './vote.model';
import CustomTable from '../../common/components/CustomTable';
import AvatarWithSingleText from '../../common/components/AvatarWithSingleText';
import SingleText from '../../common/components/SingleText';
import CustomBadge from '../../common/components/CustomBadge';
import DateText from '../../common/components/DateText';
import CustomActions from '../../common/components/CustomActions';
import { viewVoteAction } from './ViewVoteModal';
import { Color } from '../../common/constants';

type Props = ITableWithActions<Vote>;

export default function VotesTable({ actions = [], ...props }: Props) {
  const [t] = useTranslation();

  return (
    <CustomTable
      minWidth={1000}
      columns={[
        t('columns.voter'),
        t('columns.poller'),
        t('columns.description'),
        t('columns.vote'),
        t('columns.created'),
        t('columns.action'),
      ]}
      {...props}
    >
      {props.data?.result.map((vote) => (
        <tr key={vote.id}>
          <td>
            <AvatarWithSingleText {...vote.user} />
          </td>
          <td>
            <AvatarWithSingleText {...vote.poll.user} />
          </td>
          <td>
            <SingleText text={vote.poll.description} />
          </td>
          <td>
            <CustomBadge
              color={vote.type ? Color.GREEN : Color.RED}
              text={vote.type ? t('columns.up') : t('columns.down')}
            />
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
