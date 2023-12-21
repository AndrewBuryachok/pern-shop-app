import { useTranslation } from 'react-i18next';
import { getCurrentUser } from '../../features/auth/auth.slice';
import { Vote } from '../../features/polls/vote.model';
import CustomBadge from './CustomBadge';
import { Color } from '../constants';

type Props = {
  votes: Vote[];
};

export default function VoteBadge(props: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const myVote = user && props.votes.find((vote) => vote.user.id === user.id);

  return (
    <CustomBadge
      color={myVote && (myVote.type ? Color.GREEN : Color.RED)}
      text={myVote && (myVote.type ? t('columns.up') : t('columns.down'))}
    />
  );
}
