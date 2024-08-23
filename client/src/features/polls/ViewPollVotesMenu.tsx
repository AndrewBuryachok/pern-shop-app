import { ActionIcon, Group, Skeleton, Tooltip } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import {
  useSelectPollDownVotesQuery,
  useSelectPollUpVotesQuery,
} from './polls.api';
import LinkedAvatar from '../../common/components/LinkedAvatar';
import { openViewPollVotesModal } from './ViewPollVotesModal';

type Props = IModal<Poll> & { type: boolean };

export default function ViewPollVotesMenu({ data: poll, type }: Props) {
  const { data: votes, isFetching } = (
    type ? useSelectPollUpVotesQuery : useSelectPollDownVotesQuery
  )(poll.id);

  return (
    <Group spacing={8}>
      {isFetching ? (
        [...Array(5).keys()].map((key) => (
          <Skeleton key={key} width={32} h={32} />
        ))
      ) : (
        <>
          {votes?.slice(0, 4).map((vote) => (
            <Tooltip key={vote.id} label={vote.user.nick} withArrow>
              <div>
                <LinkedAvatar {...vote.user} />
              </div>
            </Tooltip>
          ))}
          <ActionIcon
            size={32}
            onClick={() => openViewPollVotesModal(poll, type)}
          >
            <IconExternalLink size={24} />
          </ActionIcon>
        </>
      )}
    </Group>
  );
}
