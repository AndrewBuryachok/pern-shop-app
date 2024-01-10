import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useDeleteArticleMutation } from './articles.api';
import { DeleteArticleDto } from './article.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { Color } from '../../common/constants';

type Props = IModal<Article>;

export default function DeleteArticleModal({ data: article }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      articleId: article.id,
    },
  });

  const [deleteArticle, { isLoading }] = useDeleteArticleMutation();

  const handleSubmit = async (dto: DeleteArticleDto) => {
    await deleteArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.articles')}
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
        <CustomImage image={article.image1} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={article.image2} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={article.image3} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const deleteArticleAction = {
  open: (article: Article) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.articles'),
      children: <DeleteArticleModal data={article} />,
    }),
  disable: () => false,
  color: Color.RED,
};
