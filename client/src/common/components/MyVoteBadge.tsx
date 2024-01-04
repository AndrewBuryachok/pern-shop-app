import { getCurrentUser } from '../../features/auth/auth.slice';
import { Vote } from '../../features/polls/vote.model';
import CustomBadge from './CustomBadge';
import VoteBadge from './VoteBadge';

type Props = {
  votes: Vote[];
};

export default function MyVoteBadge(props: Props) {
  const user = getCurrentUser();

  const myVote = user && props.votes.find((vote) => vote.user.id === user.id);

  return myVote ? <VoteBadge vote={myVote} /> : <CustomBadge />;
}
