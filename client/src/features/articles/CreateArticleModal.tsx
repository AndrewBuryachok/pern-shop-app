import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateArticleMutation } from './articles.api';
import { CreateArticleDto } from './article.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomImage from '../../common/components/CustomImage';
import { MAX_IMAGE_LENGTH, MAX_TEXT_LENGTH } from '../../common/constants';

export default function CreateArticleModal() {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      text: '',
      image: '',
    },
  });

  const [image] = useDebouncedValue(form.values.image, 500);

  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const handleSubmit = async (dto: CreateArticleDto) => {
    await createArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.article')}
    >
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
        maxLength={MAX_IMAGE_LENGTH}
        {...form.getInputProps('image')}
      />
      <CustomImage image={image} />
    </CustomForm>
  );
}

export const createArticleButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.article'),
      children: <CreateArticleModal />,
    }),
};
