import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Market } from './market.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { parseCard, parseTime } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Market>;

export default function ViewMarketModal({ data: market }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={market.id} readOnly />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...market.card.user} />}
        iconWidth={48}
        value={parseCard(market.card)}
        readOnly
      />
      <TextInput label={t('columns.market')} value={market.name} readOnly />
      <Textarea
        label={t('columns.description')}
        value={market.description || '-'}
        readOnly
      />
      <TextInput label={t('columns.x')} value={market.x} readOnly />
      <TextInput label={t('columns.y')} value={market.y} readOnly />
      <TextInput
        label={t('columns.created')}
        value={parseTime(market.createdAt)}
        readOnly
      />
    </Stack>
  );
}

export const viewMarketAction = {
  open: (market: Market) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.markets'),
      children: <ViewMarketModal data={market} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
