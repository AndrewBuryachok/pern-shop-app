import { useTranslation } from 'react-i18next';
import { ActionIcon, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import {
  useCreateCommentMutation,
  useSelectArticleCommentsQuery,
} from '../comments/comments.api';
import { CreateCommentDto } from '../comments/comment.dto';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import ReplyAvatarWithClose from '../../common/components/ReplyAvatarWithClose';
import CustomAnchor from '../../common/components/CustomAnchor';
import { editCommentAction } from '../comments/EditCommentModal';
import { deleteCommentAction } from '../comments/DeleteCommentModal';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Article>;

export default function ViewArticleCommentsModal({ data: article }: Props) {
  const [t] = useTranslation();

  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      articleId: article.id,
      commentId: 0,
      text: '',
    },
  });

  const user = getCurrentUser();

  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async (dto: CreateCommentDto) => {
    await createComment(dto);
    form.reset();
  };

  const response = useSelectArticleCommentsQuery(article.id, { skip: !opened });

  const comment = response.data?.find(
    (comment) => comment.id === form.values.commentId,
  );

  return (
    <>
      {opened ? (
        <RepliesTimeline
          {...response}
          actions={[editCommentAction, deleteCommentAction]}
          reply={(reply: Reply) => form.setFieldValue('commentId', reply.id)}
        />
      ) : (
        article.comment && <ReplyAvatarWithText {...article.comment} />
      )}
      {!!article.comments && (
        <CustomAnchor
          text={
            (opened ? t('actions.hide') : t('actions.view')) +
            ' ' +
            t('pages.all').toLowerCase() +
            ' ' +
            t('columns.comments').toLowerCase()
          }
          open={toggle}
        />
      )}
      {comment && (
        <ReplyAvatarWithClose
          {...comment}
          close={() => form.setFieldValue('commentId', 0)}
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
