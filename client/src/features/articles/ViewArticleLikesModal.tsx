import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Article } from './article.model';
import { UsersItem } from '../../common/components/UsersItem';
import { viewUsers } from '../../common/utils';

type Props = IModal<Article>;

export default function ViewArticleLikesModal({ data: article }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <Select
        label={t('columns.likes')}
        placeholder={`${t('components.total')}: ${article.likes.length}`}
        itemComponent={UsersItem}
        data={viewUsers(article.likes.map((like) => like.user))}
        limit={20}
        searchable
      />
    </Stack>
  );
}

export const openViewArticleLikesModal = (article: Article) =>
  openModal({
    title: t('actions.view') + ' ' + t('modals.likes'),
    children: <ViewArticleLikesModal data={article} />,
  });
