import { Select, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color, items } from '../../common/constants';
import { StatesItem } from '../../common/components/StatesItem';

type Props = IModal<Lot>;

export default function ViewLotModal({ data: lot }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...lot} />}
        iconWidth={48}
        value={items[lot.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={lot.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(lot)} disabled />
      <TextInput label='Price' value={`${lot.price}$`} disabled />
      <Select
        label='Bids'
        placeholder={`Total: ${lot.bids.length}`}
        itemComponent={StatesItem}
        data={viewStates(lot.bids)}
        searchable
      />
      <TextInput label='Storage' value={parseCell(lot.lease.cell)} disabled />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.cell.storage.card)}
        disabled
      />
      <TextInput label='Created' value={parseTime(lot.createdAt)} disabled />
      <TextInput
        label='Completed'
        value={parseTime(lot.completedAt)}
        disabled
      />
    </Stack>
  );
}

export const viewLotAction = {
  open: (lot: Lot) =>
    openModal({
      title: 'View Lot',
      children: <ViewLotModal data={lot} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
