import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import { useSelectStorageTagsQuery } from '../storages-tags/storages-tags.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewTags } from '../../common/utils';

type Props = IModal<Storage>;

export default function ViewStorageTagsModal({ data: storage }: Props) {
  const [t] = useTranslation();

  const { data: tags, ...tagsResponse } = useSelectStorageTagsQuery(storage.id);

  return (
    <Select
      label={t('columns.tags')}
      placeholder={`${t('components.total')}: ${tags?.length || 0}`}
      rightSection={<RefetchAction {...tagsResponse} />}
      data={viewTags(tags || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewStorageTagsAction = (storage: Storage) =>
  openModal({
    title: t('columns.cells'),
    children: <ViewStorageTagsModal data={storage} />,
  });
