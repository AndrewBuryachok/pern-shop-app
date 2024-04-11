import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketTag } from './market-tag.model';
import { useSelectTagStoresQuery } from '../stores/stores.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<MarketTag>;

export default function ViewMarketTagStoresModal({ data: marketTag }: Props) {
  const [t] = useTranslation();

  const { data: stores, ...storesResponse } = useSelectTagStoresQuery(
    marketTag.id,
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

export const openViewMarketTagStoresAction = (marketTag: MarketTag) =>
  openModal({
    title: t('columns.stores'),
    children: <ViewMarketTagStoresModal data={marketTag} />,
  });
