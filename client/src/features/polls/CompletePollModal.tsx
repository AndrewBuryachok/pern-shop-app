import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useCompletePollMutation } from './polls.api';
import { CompletePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import { parseDate } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function CompletePollModal({ data: poll }: Props) {
  const total = poll.upVotes + poll.downVotes;
  const votes = [poll.upVotes, poll.downVotes].map(
    (value) => `${value} (${Math.round((value * 100) / total)}%)`,
  );
  const created = parseDate(poll.createdAt);

  const form = useForm({
    initialValues: {
      pollId: poll.id,
    },
  });

  const [completePoll, { isLoading }] = useCompletePollMutation();

  const handleSubmit = async (dto: CompletePollDto) => {
    await completePoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Complete poll'}
    >
      <TextInput label='Poller' value={poll.user.name} disabled />
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
    </CustomForm>
  );
}

export const completePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: 'Complete Poll',
      children: <CompletePollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.GREEN,
};
