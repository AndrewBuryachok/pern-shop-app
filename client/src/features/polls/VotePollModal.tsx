import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useCreateVoteMutation } from '../votes/votes.api';
import { CreateVoteDto } from '../votes/vote.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Poll & { type: boolean }>;

export default function VotePollModal({ data: poll }: Props) {
  const form = useForm({
    initialValues: {
      pollId: poll.id,
      type: poll.type,
    },
  });

  const [createVote, { isLoading }] = useCreateVoteMutation();

  const handleSubmit = async (dto: CreateVoteDto) => {
    await createVote(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Vote poll'}
    >
      <TextInput
        label='Poller'
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.name}
        disabled
      />
      <Textarea label='Description' value={poll.description} disabled />
      <TextInput label='Vote' value={poll.type ? 'up' : 'down'} disabled />
    </CustomForm>
  );
}

export const createUpVoteAction = {
  open: (poll: Poll) =>
    openModal({
      title: 'Vote Poll',
      children: <VotePollModal data={{ ...poll, type: true }} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.GREEN,
};

export const createDownVoteAction = {
  open: (poll: Poll) =>
    openModal({
      title: 'Vote Poll',
      children: <VotePollModal data={{ ...poll, type: false }} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.RED,
};
