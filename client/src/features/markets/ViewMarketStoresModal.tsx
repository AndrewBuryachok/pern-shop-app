import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import { useSelectMarketStoresQuery } from '../stores/stores.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<Market>;

export default function ViewMarketStoresModal({ data: market }: Props) {
  const [t] = useTranslation();

  const { data: stores, ...storesResponse } = useSelectMarketStoresQuery(
    market.id,
  );

  return (
    <Select
      label={t('columns.stores')}
      placeholder={`${t('components.total')}: ${stores?.length || 0}`}
      rightSection={<RefetchAction {...storesResponse} />}
      data={viewContainers(stores || [])}
      limit={20}
      searchable
    />
  );
}

export const openViewMarketStoresAction = (market: Market) =>
  openModal({
    title: t('columns.stores'),
    children: <ViewMarketStoresModal data={market} />,
  });
