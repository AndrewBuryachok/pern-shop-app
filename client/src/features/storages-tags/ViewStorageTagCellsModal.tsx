import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageTag } from './storage-tag.model';
import { useSelectTagCellsQuery } from '../cells/cells.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<StorageTag>;

export default function ViewStorageTagCellsModal({ data: storageTag }: Props) {
  const [t] = useTranslation();

  const { data: cells, ...cellsResponse } = useSelectTagCellsQuery(
    storageTag.id,
  );

  return (
    <Select
      label={t('columns.cells')}
      placeholder={`${t('components.total')}: ${cells?.length || 0}`}
      rightSection={<RefetchAction {...cellsResponse} />}
      data={viewContainers(cells || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewStorageTagCellsAction = (storageTag: StorageTag) =>
  openModal({
    title: t('columns.cells'),
    children: <ViewStorageTagCellsModal data={storageTag} />,
  });
