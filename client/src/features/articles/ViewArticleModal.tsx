import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import CustomImage from '../../common/components/CustomImage';
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
      <Textarea label={t('columns.text')} value={article.text} disabled />
      <Input.Wrapper label={t('columns.image')}>
        <CustomImage {...article} />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewArticleAction = {
  open: (article: Article) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.article'),
      children: <ViewArticleModal data={article} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
