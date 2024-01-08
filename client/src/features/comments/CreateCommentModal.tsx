import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from '../articles/article.model';
import { useCreateCommentMutation } from './comments.api';
import { CreateCommentDto } from './comment.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { MAX_TEXT_LENGTH } from '../../common/constants';

type Props = IModal<Article>;

export default function CreateCommentModal({ data: article }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      articleId: article.id,
      text: '',
    },
  });

  const [createArticle, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async (dto: CreateCommentDto) => {
    await createArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.comments')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...article.user} />}
        iconWidth={48}
        value={article.user.nick}
        disabled
      />
      <Textarea label={t('columns.text')} value={article.text} disabled />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage {...article} />
      </Input.Wrapper>
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
    </CustomForm>
  );
}

export const openCreateCommentModal = (article: Article) =>
  openModal({
    title: t('actions.create') + ' ' + t('modals.comments'),
    children: <CreateCommentModal data={article} />,
  });
