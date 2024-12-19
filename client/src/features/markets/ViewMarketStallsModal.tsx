import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import { useSelectMarketStallsQuery } from '../stalls/stalls.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<Market>;

export default function ViewMarketStallsModal({ data: market }: Props) {
  const [t] = useTranslation();

  const { data: stalls, ...stallsResponse } = useSelectMarketStallsQuery(
    market.id,
  );

  return (
    <Select
      label={t('columns.stalls')}
      placeholder={`${t('components.total')}: ${stalls?.length || 0}`}
      rightSection={<RefetchAction {...stallsResponse} />}
      data={viewContainers(stalls || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewMarketStallsAction = (market: Market) =>
  openModal({
    title: t('columns.stalls'),
    children: <ViewMarketStallsModal data={market} />,
  });
