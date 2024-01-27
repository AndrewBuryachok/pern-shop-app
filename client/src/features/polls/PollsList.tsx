import { ActionIcon, Group, Paper, Stack } from '@mantine/core';
import { IconMessage, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { ITableWithActions } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useSelectVotedPollsQuery, useVotePollMutation } from './polls.api';
import { VotePollDto } from './poll.dto';
import CustomList from '../../common/components/CustomList';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import SingleText from '../../common/components/SingleText';
import MarkBadge from '../../common/components/MarkBadge';
import ResultBadge from '../../common/components/ResultBadge';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomAnchor from '../../common/components/CustomAnchor';
import CustomActions from '../../common/components/CustomActions';
import { openAuthModal } from '../auth/AuthModal';
import { viewPollAction } from './ViewPollModal';
import { openViewPollVotesModal } from './ViewPollVotesModal';
import { openViewPollDiscussionsModal } from './ViewPollDiscussionsModal';

type Props = ITableWithActions<Poll>;

export default function PollsList({ actions = [], ...props }: Props) {
  const user = getCurrentUser();

  const { data: votedPolls, ...votedPollsResponse } = useSelectVotedPollsQuery(
    undefined,
    { skip: !user },
  );

  const [votePoll] = useVotePollMutation();

  const handleVoteSubmit = async (dto: VotePollDto) => {
    await votePoll(dto);
  };

  return (
    <CustomList {...props}>
      {props.data?.result
        .map((poll) => ({
          ...poll,
          upVoted: votedPolls?.find(
            (votedPoll) => votedPoll.id === poll.id && votedPoll.vote.type,
          ),
          downVoted: votedPolls?.find(
            (votedPoll) => votedPoll.id === poll.id && !votedPoll.vote.type,
          ),
        }))
        .map((poll) => (
          <Paper key={poll.id} p='md'>
            <Stack spacing={8}>
              <Group spacing={0} position='apart'>
                <AvatarWithDateText {...poll} />
                <CustomActions
                  data={poll}
                  actions={[viewPollAction, ...actions]}
                />
              </Group>
              <SingleText text={poll.text} />
              <Group spacing={8}>
                <MarkBadge {...poll} />
                <ResultBadge {...poll} />
              </Group>
              {poll.image && <CustomImage image={poll.image} />}
              {poll.video && <CustomVideo video={poll.video} />}
              <Group spacing={8}>
                <ActionIcon
                  size={24}
                  variant={poll.upVoted && 'filled'}
                  color={poll.upVoted && 'violet'}
                  loading={votedPollsResponse.isLoading}
                  onClick={() =>
                    user
                      ? handleVoteSubmit({ pollId: poll.id, type: true })
                      : openAuthModal()
                  }
                >
                  <IconThumbUp size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${poll.upVotes}`}
                  open={() => openViewPollVotesModal(poll)}
                />
                <ActionIcon
                  size={24}
                  variant={poll.downVoted && 'filled'}
                  color={poll.downVoted && 'violet'}
                  loading={votedPollsResponse.isLoading}
                  onClick={() =>
                    user
                      ? handleVoteSubmit({ pollId: poll.id, type: false })
                      : openAuthModal()
                  }
                >
                  <IconThumbDown size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${poll.downVotes}`}
                  open={() => openViewPollVotesModal(poll)}
                />
                <ActionIcon
                  size={24}
                  onClick={() =>
                    user ? openViewPollDiscussionsModal(poll) : openAuthModal()
                  }
                >
                  <IconMessage size={16} />
                </ActionIcon>
                <CustomAnchor
                  text={`${poll.discussions}`}
                  open={() => openViewPollDiscussionsModal(poll)}
                />
              </Group>
            </Stack>
          </Paper>
        ))}
    </CustomList>
  );
}
