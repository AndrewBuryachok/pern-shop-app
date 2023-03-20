import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useDeletePollMutation } from './polls.api';
import { DeletePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseDate } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function DeletePollModal({ data: poll }: Props) {
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

  const [deletePoll, { isLoading }] = useDeletePollMutation();

  const handleSubmit = async (dto: DeletePollDto) => {
    await deletePoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Delete poll'}
    >
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
    </CustomForm>
  );
}

export const deletePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: 'Delete Poll',
      children: <DeletePollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.RED,
};
