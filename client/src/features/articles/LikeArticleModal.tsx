import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { useLikeArticleMutation } from './articles.api';
import { LikeArticleDto } from './article.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import { Color } from '../../common/constants';

type Props = IModal<Article>;

export default function LikeArticleModal({ data: article }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      articleId: article.id,
    },
  });

  const [likeArticle, { isLoading }] = useLikeArticleMutation();

  const handleSubmit = async (dto: LikeArticleDto) => {
    await likeArticle(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.like') + ' ' + t('modals.articles')}
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
    </CustomForm>
  );
}

export const likeArticleAction = {
  open: (article: Article) =>
    openModal({
      title: t('actions.like') + ' ' + t('modals.articles'),
      children: <LikeArticleModal data={article} />,
    }),
  disable: () => false,
  color: Color.GREEN,
};
