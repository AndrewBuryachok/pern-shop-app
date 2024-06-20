import { useTranslation } from 'react-i18next';
import { ActionIcon, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Poll } from './poll.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useCreateDiscussionMutation } from '../discussions/discussions.api';
import { useSelectPollDiscussionsQuery } from './polls.api';
import { CreateDiscussionDto } from '../discussions/discussion.dto';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import ReplyAvatarWithClose from '../../common/components/ReplyAvatarWithClose';
import CustomAnchor from '../../common/components/CustomAnchor';
import { editDiscussionAction } from '../discussions/EditDiscussionModal';
import { deleteDiscussionAction } from '../discussions/DeleteDiscussionModal';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Poll>;

export default function ViewPollDiscussionsModal({ data: poll }: Props) {
  const [t] = useTranslation();

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      pollId: poll.id,
      discussionId: 0,
      text: '',
    },
  });

  const user = getCurrentUser();

  const [createDiscussion, { isLoading }] = useCreateDiscussionMutation();

  const handleSubmit = async (dto: CreateDiscussionDto) => {
    await createDiscussion(dto);
    form.reset();
  };

  const response = useSelectPollDiscussionsQuery(poll.id, { skip: !opened });

  const discussion = response.data?.find(
    (discussion) => discussion.id === form.values.discussionId,
  );

  return (
    <>
      {opened ? (
        <RepliesTimeline
          {...response}
          actions={[editDiscussionAction, deleteDiscussionAction]}
          reply={(reply: Reply) => form.setFieldValue('discussionId', reply.id)}
        />
      ) : (
        poll.discussion && <ReplyAvatarWithText {...poll.discussion} />
      )}
      {!!poll.discussions && (
        <CustomAnchor
          text={
            (opened ? t('actions.hide') : t('actions.view')) +
            ' ' +
            t('pages.all').toLowerCase() +
            ' ' +
            t('columns.discussions').toLowerCase()
          }
          open={toggle}
        />
      )}
      {discussion && (
        <ReplyAvatarWithClose
          {...discussion}
          close={() => form.setFieldValue('discussionId', 0)}
        />
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          placeholder={t('columns.reply')}
          rightSection={
            <ActionIcon size={24} type='submit' disabled={!user || isLoading}>
              <IconSend size={16} />
            </ActionIcon>
          }
          required
          autosize
          maxLength={MAX_TEXT_LENGTH}
          {...form.getInputProps('text')}
        />
      </form>
    </>
  );
}
