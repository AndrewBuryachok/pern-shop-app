import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useCreateDiscussionMutation } from '../discussions/discussions.api';
import { useSelectPollDiscussionsQuery } from './polls.api';
import { CreateDiscussionDto } from '../discussions/discussion.dto';
import CustomForm from '../../common/components/CustomForm';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import { editDiscussionAction } from '../discussions/EditDiscussionModal';
import { deleteDiscussionAction } from '../discussions/DeleteDiscussionModal';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Poll>;

export default function ViewPollDiscussionsModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      text: '',
    },
  });

  const [createDiscussion, { isLoading }] = useCreateDiscussionMutation();

  const handleSubmit = async (dto: CreateDiscussionDto) => {
    await createDiscussion(dto);
  };

  const response = useSelectPollDiscussionsQuery(poll.id);

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      isChanged={!user}
      text={t('actions.create') + ' ' + t('modals.discussions')}
    >
      <RepliesTimeline
        {...response}
        actions={[editDiscussionAction, deleteDiscussionAction]}
      />
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

export const openViewPollDiscussionsModal = (poll: Poll) =>
  openModal({
    title: t('columns.discussions'),
    children: <ViewPollDiscussionsModal data={poll} />,
  });
