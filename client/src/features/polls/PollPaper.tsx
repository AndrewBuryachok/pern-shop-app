import { useEffect } from 'react';
import { ActionIcon, Group, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import {
  IconEye,
  IconMessage,
  IconThumbDown,
  IconThumbUp,
} from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Poll, SmPoll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useViewPollMutation, useVotePollMutation } from './polls.api';
import { ViewPollDto, VotePollDto } from './poll.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import MarkBadge from '../../common/components/MarkBadge';
import ResultBadge from '../../common/components/ResultBadge';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomAnchor from '../../common/components/CustomAnchor';
import CustomActions from '../../common/components/CustomActions';
import { openAuthModal } from '../auth/AuthModal';
import { viewPollAction } from './ViewPollModal';
import { openViewPollViewsModal } from './ViewPollViewsModal';
import { openViewPollVotesModal } from './ViewPollVotesModal';
import { openViewPollDiscussionsModal } from './ViewPollDiscussionsModal';

type Props = {
  poll: Poll & {
    viewed: boolean;
    upVoted?: SmPoll;
    downVoted?: SmPoll;
  };
  isViewedLoading: boolean;
  isVotedLoading: boolean;
  actions: IAction<Poll>[];
};

export default function PollPaper({ poll, ...props }: Props) {
  const user = getCurrentUser();

  const [viewPoll] = useViewPollMutation();

  const handleViewSubmit = async (dto: ViewPollDto) => {
    await viewPoll(dto);
  };

  const [votePoll] = useVotePollMutation();

  const handleVoteSubmit = async (dto: VotePollDto) => {
    await votePoll(dto);
  };

  const { ref, entry } = useIntersection();

  useEffect(() => {
    if (user && !poll.viewed && entry?.isIntersecting) {
      handleViewSubmit({ pollId: poll.id });
    }
  }, [entry?.isIntersecting]);

  return (
    <Paper p='md'>
      <Stack spacing={8}>
        <Group spacing={0} position='apart'>
          <AvatarWithDateText {...poll} />
          <CustomActions
            data={poll}
            actions={[viewPollAction, ...props.actions]}
          />
        </Group>
        <CustomHighlight text={poll.text} />
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
            color={poll.upVoted && 'pink'}
            loading={props.isVotedLoading}
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
            color={poll.downVoted && 'pink'}
            loading={props.isVotedLoading}
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
          <ActionIcon
            ref={ref}
            size={24}
            loading={props.isViewedLoading}
            onClick={() => openViewPollViewsModal(poll)}
          >
            <IconEye size={16} />
          </ActionIcon>
          <CustomAnchor
            text={`${poll.views}`}
            open={() => openViewPollViewsModal(poll)}
          />
        </Group>
      </Stack>
    </Paper>
  );
}
