import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { useCompletePollMutation } from './polls.api';
import { PollIdDto } from './poll.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { Color } from '../../common/constants';

type Props = IModal<Poll>;

export default function CompletePollModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
    },
  });

  const [completePoll, { isLoading }] = useCompletePollMutation();

  const handleSubmit = async (dto: PollIdDto) => {
    await completePoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.polls')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        disabled
      />
      <TextInput label={t('columns.title')} value={poll.title} disabled />
      <Textarea label={t('columns.text')} value={poll.text} disabled />
    </CustomForm>
  );
}

export const completePollAction = {
  open: (poll: Poll) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.polls'),
      children: <CompletePollModal data={poll} />,
    }),
  disable: (poll: Poll) => !!poll.completedAt,
  color: Color.GREEN,
};
