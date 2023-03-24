import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ThingsItem } from '../../common/components/ThingItem';
import {
  parseCard,
  parseCell,
  parseDate,
  viewThings,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lease>;

export default function ViewLeaseModal({ data: lease }: Props) {
  const created = parseDate(lease.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Renter'
        icon={<CustomAvatar {...lease.card.user} />}
        iconWidth={48}
        value={parseCard(lease.card)}
        disabled
      />
      <TextInput
        label='Lessor'
        icon={<CustomAvatar {...lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lease.cell.storage.card)}
        disabled
      />
      <TextInput label='Storage' value={parseCell(lease.cell)} disabled />
      <TextInput label='Sum' value={`${lease.cell.storage.price}$`} disabled />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
      <Select
        label='Products'
        placeholder={`Total: ${lease.products.length}`}
        itemComponent={ThingsItem}
        data={viewThings(lease.products)}
        searchable
      />
    </Stack>
  );
}

export const viewLeaseAction = {
  open: (lease: Lease) =>
    openModal({
      title: 'View Lease',
      children: <ViewLeaseModal data={lease} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
