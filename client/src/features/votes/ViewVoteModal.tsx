import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Vote } from './vote.model';
import { parseDate } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Vote>;

export default function ViewVoteModal({ data: vote }: Props) {
  const created = parseDate(vote.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput label='Voter' value={vote.user.name} disabled />
      <TextInput label='Poller' value={vote.poll.user.name} disabled />
      <Textarea label='Description' value={vote.poll.description} disabled />
      <TextInput label='Vote' value={vote.type ? 'up' : 'down'} disabled />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
    </Stack>
  );
}

export const viewVoteAction = {
  open: (vote: Vote) =>
    openModal({
      title: 'View Vote',
      children: <ViewVoteModal data={vote} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
