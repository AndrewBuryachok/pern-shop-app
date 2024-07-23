import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Station } from './station.model';
import { useSelectStationDrawersQuery } from '../drawers/drawers.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<Station>;

export default function ViewStationDrawersModal({ data: station }: Props) {
  const [t] = useTranslation();

  const { data: drawers, ...drawersResponse } = useSelectStationDrawersQuery(
    station.id,
  );

  return (
    <Select
      label={t('columns.drawers')}
      placeholder={`${t('components.total')}: ${drawers?.length || 0}`}
      rightSection={<RefetchAction {...drawersResponse} />}
      data={viewContainers(drawers || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewStationDrawersAction = (station: Station) =>
  openModal({
    title: t('columns.drawers'),
    children: <ViewStationDrawersModal data={station} />,
  });
