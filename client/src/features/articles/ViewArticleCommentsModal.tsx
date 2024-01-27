import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { Reply } from '../replies/reply.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useCreateCommentMutation } from '../comments/comments.api';
import { useSelectArticleCommentsQuery } from './articles.api';
import { CreateCommentDto } from '../comments/comment.dto';
import CustomForm from '../../common/components/CustomForm';
import RepliesTimeline from '../../common/components/RepliesTimeline';
import ReplyAvatarWithText from '../../common/components/ReplyAvatarWithText';
import { editCommentAction } from '../comments/EditCommentModal';
import { deleteCommentAction } from '../comments/DeleteCommentModal';
import { Color, MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Article>;

export default function ViewArticleCommentsModal({ data: article }: Props) {
  const [t] = useTranslation();

  const user = getCurrentUser();

  const form = useForm({
    initialValues: {
      articleId: article.id,
      commentId: 0,
      text: '',
    },
  });

  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async (dto: CreateCommentDto) => {
    await createComment(dto);
  };

  const response = useSelectArticleCommentsQuery(article.id);

  const comment = response.data?.find(
    (comment) => comment.id === form.values.commentId,
  );

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      isChanged={!user}
      text={t('actions.create') + ' ' + t('modals.comments')}
    >
      <RepliesTimeline
        {...response}
        actions={[
          {
            open: (reply: Reply) =>
              form.setFieldValue(
                'commentId',
                reply.id === form.values.commentId ? 0 : reply.id,
              ),
            disable: () => false,
            color: Color.GREEN,
          },
          editCommentAction,
          deleteCommentAction,
        ]}
      />
      {comment && <ReplyAvatarWithText {...comment} />}
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

export const openViewArticleCommentsModal = (article: Article) =>
  openModal({
    title: t('columns.comments'),
    children: <ViewArticleCommentsModal data={article} />,
  });
