import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketTag } from './market-tag.model';
import { useSelectTagStallsQuery } from '../stalls/stalls.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewContainers } from '../../common/utils';

type Props = IModal<MarketTag>;

export default function ViewMarketTagStallsModal({ data: marketTag }: Props) {
  const [t] = useTranslation();

  const { data: stalls, ...stallsResponse } = useSelectTagStallsQuery(
    marketTag.id,
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

export const openViewMarketTagStallsAction = (marketTag: MarketTag) =>
  openModal({
    title: t('columns.stalls'),
    children: <ViewMarketTagStallsModal data={marketTag} />,
  });
