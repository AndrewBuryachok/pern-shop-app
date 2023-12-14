import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseCell,
  parseItem,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lot>;

export default function ViewLotModal({ data: lot }: Props) {
  const [t] = useTranslation();

  return (
    <Stack spacing={8}>
      <TextInput label={t('columns.id')} value={lot.id} disabled />
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...lot} />}
        iconWidth={48}
        value={parseItem(lot.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={lot.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(lot)}
        disabled
      />
      <TextInput label={t('columns.price')} value={`${lot.price}$`} disabled />
      <Select
        label={t('columns.bids')}
        placeholder={`${t('components.total')}: ${lot.bids.length}`}
        itemComponent={StatesItem}
        data={viewStates(lot.bids)}
        limit={20}
        searchable
      />
      <TextInput
        label={t('columns.storage')}
        value={parseCell(lot.lease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.owner')}
        icon={<CustomAvatar {...lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.cell.storage.card)}
        disabled
      />
      <TextInput
        label={t('columns.created')}
        value={parseTime(lot.createdAt)}
        disabled
      />
      <TextInput
        label={t('columns.completed')}
        value={parseTime(lot.completedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewLotAction = {
  open: (lot: Lot) =>
    openModal({
      title: t('actions.view') + ' ' + t('modals.lot'),
      children: <ViewLotModal data={lot} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
