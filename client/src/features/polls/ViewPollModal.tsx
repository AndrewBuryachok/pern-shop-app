import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseDate } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function ViewPollModal({ data: poll }: Props) {
  const total = poll.upVotes + poll.downVotes;
  const votes = [poll.upVotes, poll.downVotes].map(
    (value) => `${value} (${total && Math.round((value * 100) / total)}%)`,
  );
  const created = parseDate(poll.createdAt);
  const completed = poll.completedAt && parseDate(poll.completedAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Poller'
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.name}
        disabled
      />
      <Textarea label='Description' value={poll.description} disabled />
      <TextInput label='Up' value={votes[0]} disabled />
      <TextInput label='Down' value={votes[1]} disabled />
      <TextInput
        label='My'
        value={poll.myVote ? (poll.myVote.type ? 'up' : 'down') : '-'}
        disabled
      />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
      <TextInput
        label='Completed'
        value={completed ? `${completed.date} ${completed.time}` : '-'}
        disabled
      />
    </Stack>
  );
}

export const viewPollAction = {
  open: (poll: Poll) =>
    openModal({
      title: 'View Poll',
      children: <ViewPollModal data={poll} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
