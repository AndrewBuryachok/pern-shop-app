import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useCompletePollMutation } from './polls.api';
import { CompletePollDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function CompletePollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const total = poll.upVotes + poll.downVotes;
  const votes = [poll.upVotes, poll.downVotes].map(
    (value) => `${value} (${Math.round((value * 100) / total)}%)`,
  );

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
      text={t('actions.complete') + ' ' + t('modals.poll')}
    >
      <TextInput
        label={t('columns.poller')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.name}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={poll.description}
        disabled
      />
      <TextInput label={t('columns.up')} value={votes[0]} disabled />
      <TextInput label={t('columns.down')} value={votes[1]} disabled />
      <TextInput
        label={t('columns.my')}
        value={
          poll.myVote
            ? poll.myVote.type
              ? t('columns.up')
              : t('columns.down')
            : '-'
        }
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(poll.createdAt)}
        disabled
      />
    </CustomForm>
  );
}

export const completePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.poll'),
      children: <CompletePollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.GREEN,
};
