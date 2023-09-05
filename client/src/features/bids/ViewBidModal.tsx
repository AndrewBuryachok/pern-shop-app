import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Bid } from './bid.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseThingAmount,
  parseTime,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Bid>;

export default function ViewBidModal({ data: bid }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Buyer'
        icon={<CustomAvatar {...bid.card.user} />}
        iconWidth={48}
        value={parseCard(bid.card)}
        disabled
      />
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...bid.lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(bid.lot.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...bid.lot} />}
        iconWidth={48}
        value={items[bid.lot.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={bid.lot.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(bid.lot)} disabled />
      <TextInput label='Sum' value={`${bid.price}$`} disabled />
      <TextInput
        label='Storage'
        value={parseCell(bid.lot.lease.cell)}
        disabled
      />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...bid.lot.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(bid.lot.lease.cell.storage.card)}
        disabled
      />
      <TextInput label='Created' value={parseTime(bid.createdAt)} disabled />
    </Stack>
  );
}

export const viewBidAction = {
  open: (bid: Bid) =>
    openModal({
      title: 'View Bid',
      children: <ViewBidModal data={bid} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
