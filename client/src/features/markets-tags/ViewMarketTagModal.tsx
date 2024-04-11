import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketTag } from './market-tag.model';
import { useSelectMarketTagStatesQuery } from './markets-tags.api';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parsePlace,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<MarketTag>;

export default function ViewMarketTagModal({ data: marketTag }: Props) {
  const [t] = useTranslation();

  const { data: states, ...statesResponse } = useSelectMarketTagStatesQuery(
    marketTag.id,
  );

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={marketTag.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...marketTag.market.card.user} />}
        iconWidth={48}
        value={parseCard(marketTag.market.card)}
        readOnly
      />
      <TextInput
        label={t('columns.market')}
        value={parsePlace(marketTag.market)}
        readOnly
      />
      <TextInput label={t('columns.tag')} value={marketTag.name} readOnly />
      <TextInput
        label={t('columns.price')}
        value={`${marketTag.price} ${t('constants.currency')}`}
        readOnly
      />
      <Select
        label={t('columns.prices')}
        placeholder={`${t('components.total')}: ${states?.length || 0}`}
        rightSection={<RefetchAction {...statesResponse} />}
        itemComponent={StatesItem}
        data={viewStates(states || [])}
        limit={20}
        searchable
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(marketTag.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewMarketTagAction = {
  open: (market: MarketTag) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.markets'),
      children: <ViewMarketTagModal data={market} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
