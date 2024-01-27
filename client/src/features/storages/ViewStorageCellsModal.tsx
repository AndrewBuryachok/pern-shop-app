import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Storage } from './storage.model';
import { useSelectStorageCellsQuery } from '../cells/cells.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<Storage>;

export default function ViewStorageCellsModal({ data: storage }: Props) {
  const [t] = useTranslation();

  const { data: cells, ...cellsResponse } = useSelectStorageCellsQuery(
    storage.id,
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

export const openViewStorageCellsAction = (storage: Storage) =>
  openModal({
    title: t('columns.cells'),
    children: <ViewStorageCellsModal data={storage} />,
  });
