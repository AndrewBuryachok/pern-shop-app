import { useEffect } from 'react';
import { Button, Group, Paper, Stack } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { IconEye, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { IAction } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useViewPollMutation, useVotePollMutation } from './polls.api';
import { ViewPollDto, VotePollDto } from './poll.dto';
import AvatarWithDateText from '../../common/components/AvatarWithDateText';
import CustomHighlight from '../../common/components/CustomHighlight';
import MarkBadge from '../../common/components/MarkBadge';
import ResultBadge from '../../common/components/ResultBadge';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import CustomActions from '../../common/components/CustomActions';
import ViewPollDiscussionsModal from './ViewPollDiscussionsModal';
import { openAuthModal } from '../auth/AuthModal';
import { viewPollAction } from './ViewPollModal';
import { openViewPollViewsModal } from './ViewPollViewsModal';

type Props = {
  poll: Poll & {
    viewed: boolean;
    upVoted: boolean;
    downVoted: boolean;
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
    await votePoll({
      ...dto,
      upVoted: !!poll.upVoted,
      downVoted: !!poll.downVoted,
    });
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
        <Group spacing={0} position='apart'>
          <Group spacing={8}>
            <Button
              leftIcon={<IconThumbUp size={16} />}
              variant={poll.upVoted ? 'filled' : 'light'}
              color={poll.upVoted ? 'violet' : 'gray'}
              loading={props.isVotedLoading}
              onClick={() =>
                user
                  ? handleVoteSubmit({ pollId: poll.id, type: true })
                  : openAuthModal()
              }
              compact
            >
              {poll.upVotes}
            </Button>
            <Button
              leftIcon={<IconThumbDown size={16} />}
              variant={poll.downVoted ? 'filled' : 'light'}
              color={poll.downVoted ? 'violet' : 'gray'}
              loading={props.isVotedLoading}
              onClick={() =>
                user
                  ? handleVoteSubmit({ pollId: poll.id, type: false })
                  : openAuthModal()
              }
              compact
            >
              {poll.downVotes}
            </Button>
          </Group>
          <Button
            ref={ref}
            leftIcon={<IconEye size={16} />}
            variant='light'
            color='gray'
            loading={props.isViewedLoading}
            onClick={() => openViewPollViewsModal(poll)}
            compact
          >
            {poll.views}
          </Button>
        </Group>
        <ViewPollDiscussionsModal data={poll} />
      </Stack>
    </Paper>
  );
}
