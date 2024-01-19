import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
import CustomVideo from '../../common/components/CustomVideo';
import { parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Article>;

export default function ViewArticleModal({ data: article }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={article.id} disabled />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...article.user} />}
        iconWidth={48}
        value={article.user.nick}
        disabled
      />
      <Textarea
        label={t('columns.text')}
        value={article.text}
        autosize
        disabled
      />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={article.image1} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={article.image2} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage image={article.image3} />
      </Input.Wrapper>
      <Input.Wrapper label={t('columns.video')}>
        <CustomVideo video={article.video} />
      </Input.Wrapper>
      <TextInput
        label={t('columns.created')}
        value={parseTime(article.createdAt)}
        disabled
      />
    </Stack>
  );
}

export const viewArticleAction = {
  open: (article: Article) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.articles'),
      children: <ViewArticleModal data={article} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
