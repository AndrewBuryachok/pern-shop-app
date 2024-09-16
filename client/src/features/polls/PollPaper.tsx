import { useEffect } from 'react';
import { Button, Group, Menu, Paper, Stack } from '@mantine/core';
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
import ViewPollViewsMenu from './ViewPollViewsMenu';
import ViewPollVotesMenu from './ViewPollVotesMenu';
import ViewPollCommentsModal from './ViewPollCommentsModal';
import { openAuthModal } from '../auth/AuthModal';
import { viewPollAction } from './ViewPollModal';

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
            <Menu
              zIndex={100}
              offset={4}
              position='top-start'
              trigger='hover'
              withArrow
            >
              <Menu.Target>
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
              </Menu.Target>
              <Menu.Dropdown>
                <ViewPollVotesMenu data={poll} type={true} />
              </Menu.Dropdown>
            </Menu>
            <Menu
              zIndex={100}
              offset={4}
              position='top-start'
              trigger='hover'
              withArrow
            >
              <Menu.Target>
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
              </Menu.Target>
              <Menu.Dropdown>
                <ViewPollVotesMenu data={poll} type={false} />
              </Menu.Dropdown>
            </Menu>
          </Group>
          <Menu
            zIndex={100}
            offset={4}
            position='top-end'
            trigger='hover'
            withArrow
          >
            <Menu.Target>
              <Button
                ref={ref}
                leftIcon={<IconEye size={16} />}
                variant='light'
                color='gray'
                loading={props.isViewedLoading}
                compact
              >
                {poll.views}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <ViewPollViewsMenu data={poll} />
            </Menu.Dropdown>
          </Menu>
        </Group>
        <ViewPollCommentsModal data={poll} />
      </Stack>
    </Paper>
  );
}
