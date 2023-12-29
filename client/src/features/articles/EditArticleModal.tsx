import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useEditArticleMutation } from './articles.api';
import { EditArticleDto } from './article.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import {
  Color,
  MAX_IMAGE_LENGTH,
  MAX_TEXT_LENGTH,
} from '../../common/constants';

type Props = IModal<Article>;

export default function EditArticleModal({ data: article }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      articleId: article.id,
      text: article.text,
      image: article.image,
    },
  });

  const [image] = useDebouncedValue(form.values.image, 500);

  const [editArticle, { isLoading }] = useEditArticleMutation();

  const handleSubmit = async (dto: EditArticleDto) => {
    await editArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.articles')}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...article.user} />}
        iconWidth={48}
        value={article.user.nick}
        disabled
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        required
        maxLength={MAX_IMAGE_LENGTH}
        {...form.getInputProps('image')}
      />
      <CustomImage image={image} />
    </CustomForm>
  );
}

export const editArticleAction = {
  open: (article: Article) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.articles'),
      children: <EditArticleModal data={article} />,
    }),
  disable: () => false,
  color: Color.YELLOW,
};
