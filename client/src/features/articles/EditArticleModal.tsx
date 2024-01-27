import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { getCurrentUser } from '../auth/auth.slice';
import { useEditArticleMutation } from './articles.api';
import { EditArticleDto } from './article.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { isUserNotHasRole } from '../../common/utils';
import {
  Color,
  MAX_LINK_LENGTH,
  MAX_TEXT_LENGTH,
  Role,
} from '../../common/constants';

type Props = IModal<Article>;

export default function EditArticleModal({ data: article }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      articleId: article.id,
      text: article.text,
      image1: article.image1,
      image2: article.image2,
      image3: article.image3,
      video: article.video,
    },
  });

  const [image1] = useDebouncedValue(form.values.image1, 500);
  const [image2] = useDebouncedValue(form.values.image2, 500);
  const [image3] = useDebouncedValue(form.values.image3, 500);
  const [video] = useDebouncedValue(form.values.video, 500);

  const [editArticle, { isLoading }] = useEditArticleMutation();

  const handleSubmit = async (dto: EditArticleDto) => {
    await editArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.articles')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...article.user} />}
        iconWidth={48}
        value={article.user.nick}
        readOnly
      />
      <Textarea
        label={t('columns.text')}
        placeholder={t('columns.text')}
        required
        autosize
        maxLength={MAX_TEXT_LENGTH}
        {...form.getInputProps('text')}
      />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image1')}
      />
      <CustomImage image={image1} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image2')}
      />
      <CustomImage image={image2} />
      <Textarea
        label={t('columns.image')}
        placeholder={t('columns.image')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('image3')}
      />
      <CustomImage image={image3} />
      <Textarea
        label={t('columns.video')}
        placeholder={t('columns.video')}
        maxLength={MAX_LINK_LENGTH}
        {...form.getInputProps('video')}
      />
      <CustomVideo video={video} />
    </CustomForm>
  );
}

export const editArticleAction = {
  open: (article: Article) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.articles'),
      children: <EditArticleModal data={article} />,
    }),
  disable: (article: Article) => {
    const user = getCurrentUser();
    return isUserNotHasRole(Role.ADMIN) && article.user.id !== user?.id;
  },
  color: Color.YELLOW,
};
