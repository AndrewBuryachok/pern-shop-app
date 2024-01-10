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
      image1: '',
      image2: '',
      image3: '',
    },
  });

  const [image1] = useDebouncedValue(form.values.image1, 500);
  const [image2] = useDebouncedValue(form.values.image2, 500);
  const [image3] = useDebouncedValue(form.values.image3, 500);

  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const handleSubmit = async (dto: CreateArticleDto) => {
    await createArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.create') + ' ' + t('modals.articles')}
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
        {...form.getInputProps('image1')}
      />
      <CustomImage image={image1} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_IMAGE_LENGTH}
        {...form.getInputProps('image2')}
      />
      <CustomImage image={image2} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_IMAGE_LENGTH}
        {...form.getInputProps('image3')}
      />
      <CustomImage image={image3} />
    </CustomForm>
  );
}

export const createArticleButton = {
  label: 'create',
  open: () =>
    openModal({
      title: t('actions.create') + ' ' + t('modals.articles'),
      children: <CreateArticleModal />,
    }),
};
