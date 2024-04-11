import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import { useSelectMarketTagsQuery } from '../markets-tags/markets-tags.api';
import RefetchAction from '../../common/components/RefetchAction';
import { viewTags } from '../../common/utils';

type Props = IModal<Market>;

export default function ViewMarketTagsModal({ data: market }: Props) {
  const [t] = useTranslation();

  const { data: tags, ...tagsResponse } = useSelectMarketTagsQuery(market.id);

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

export const openViewMarketTagsAction = (market: Market) =>
  openModal({
    title: t('columns.tags'),
    children: <ViewMarketTagsModal data={market} />,
  });
