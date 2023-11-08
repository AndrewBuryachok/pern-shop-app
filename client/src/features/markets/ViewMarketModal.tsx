import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { StatesItem } from '../../common/components/StatesItem';
import { parseCard, viewContainers, viewStates } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Market>;

export default function ViewMarketModal({ data: market }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...market.card.user} />}
        iconWidth={48}
        value={parseCard(market.card)}
        disabled
      />
      <TextInput label={t('columns.market')} value={market.name} disabled />
      <TextInput label={t('columns.x')} value={market.x} disabled />
      <TextInput label={t('columns.y')} value={market.y} disabled />
      <TextInput
        label={t('columns.price')}
        value={`${market.price}$`}
        disabled
      />
      <Select
        label={t('columns.prices')}
        placeholder={`${t('components.total')}: ${market.states.length}`}
        itemComponent={StatesItem}
        data={viewStates(market.states)}
        searchable
      />
      <Select
        label={t('columns.stores')}
        placeholder={`${t('components.total')}: ${market.stores.length}`}
        data={viewContainers(market.stores)}
        searchable
      />
    </Stack>
  );
}

export const viewMarketAction = {
  open: (market: Market) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.market'),
      children: <ViewMarketModal data={market} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
