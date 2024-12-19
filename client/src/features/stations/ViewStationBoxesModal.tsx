import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Station } from './station.model';
import { useSelectStationBoxesQuery } from '../boxes/boxes.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<Station>;

export default function ViewStationBoxesModal({ data: station }: Props) {
  const [t] = useTranslation();

  const { data: boxes, ...boxesResponse } = useSelectStationBoxesQuery(
    station.id,
  );

  return (
    <Select
      label={t('columns.boxes')}
      placeholder={`${t('components.total')}: ${boxes?.length || 0}`}
      rightSection={<RefetchAction {...boxesResponse} />}
      data={viewContainers(boxes || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewStationBoxesAction = (station: Station) =>
  openModal({
    title: t('columns.boxes'),
    children: <ViewStationBoxesModal data={station} />,
  });
