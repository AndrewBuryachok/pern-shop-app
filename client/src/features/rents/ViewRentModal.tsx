import { NativeSelect, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Rent } from './rent.model';
import {
  parseCard,
  parseDate,
  parseStore,
  viewThings,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Rent>;

export default function ViewRentModal({ data: rent }: Props) {
  const created = parseDate(rent.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput label='Renter' value={parseCard(rent.card)} disabled />
      <TextInput
        label='Lessor'
        value={parseCard(rent.store.market.card)}
        disabled
      />
      <TextInput label='Storage' value={parseStore(rent.store)} disabled />
      <TextInput label='Sum' value={`${rent.store.market.price}$`} disabled />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
      <NativeSelect label='Wares' data={viewThings(rent.wares)} />
    </Stack>
  );
}

export const viewRentAction = {
  open: (rent: Rent) =>
    openModal({
      title: 'View Rent',
      children: <ViewRentModal data={rent} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
