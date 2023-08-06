import { Select, Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lease } from './lease.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import { ThingsItem } from '../../common/components/ThingItem';
import {
  parseCard,
  parseCell,
  parseTime,
  viewThings,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Lease>;

export default function ViewLeaseModal({ data: lease }: Props) {
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
        label='Owner'
        icon={<CustomAvatar {...lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(lease.cell.storage.card)}
        disabled
      />
      <TextInput label='Storage' value={parseCell(lease.cell)} disabled />
      <TextInput label='Sum' value={`${lease.cell.storage.price}$`} disabled />
      <TextInput label='Created' value={parseTime(lease.createdAt)} disabled />
      <TextInput label='Type' value={lease.type} disabled />
      <Select
        label='Things'
        placeholder={`Total: ${[lease.thing].length}`}
        itemComponent={ThingsItem}
        data={viewThings([lease.thing])}
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
