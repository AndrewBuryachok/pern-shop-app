import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from '../polls/poll.model';
import { useCreateDiscussionMutation } from './discussions.api';
import { CreateDiscussionDto } from './discussion.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Poll>;

export default function CreateDiscussionModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      text: '',
    },
  });

  const [createPoll, { isLoading }] = useCreateDiscussionMutation();

  const handleSubmit = async (dto: CreateDiscussionDto) => {
    await createPoll(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.discussion') + ' ' + t('modals.polls')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...poll.user} />}
        iconWidth={48}
        value={poll.user.nick}
        readOnly
      />
      <Textarea label={t('columns.text')} value={poll.text} readOnly />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={poll.image} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const openCreateDiscussionModal = (poll: Poll) =>
  openModal({
    title: t('actions.discussion') + ' ' + t('modals.polls'),
    children: <CreateDiscussionModal data={poll} />,
  });
