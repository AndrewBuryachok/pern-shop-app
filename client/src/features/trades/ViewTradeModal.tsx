import { Input, Rating, Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Trade } from './trade.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseStore,
  parseTime,
  parseTradeAmount,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Trade>;

export default function ViewTradeModal({ data: trade }: Props) {
  return (
    <Stack spacing={8}>
      <TextInput
        label='Buyer'
        icon={<CustomAvatar {...trade.card.user} />}
        iconWidth={48}
        value={parseCard(trade.card)}
        disabled
      />
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...trade.ware.rent.card.user} />}
        iconWidth={48}
        value={parseCard(trade.ware.rent.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...trade.ware} />}
        iconWidth={48}
        value={items[trade.ware.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={trade.ware.description} disabled />
      <TextInput label='Amount' value={parseTradeAmount(trade)} disabled />
      <TextInput
        label='Sum'
        value={`${trade.amount * trade.ware.price}$`}
        disabled
      />
      <TextInput
        label='Market'
        value={parseStore(trade.ware.rent.store)}
        disabled
      />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...trade.ware.rent.store.market.card.user} />}
        iconWidth={48}
        value={parseCard(trade.ware.rent.store.market.card)}
        disabled
      />
      <TextInput label='Created' value={parseTime(trade.createdAt)} disabled />
      <Input.Wrapper label='Rate'>
        <Rating value={trade.rate} readOnly />
      </Input.Wrapper>
    </Stack>
  );
}

export const viewTradeAction = {
  open: (trade: Trade) =>
    openModal({
      title: 'View Trade',
      children: <ViewTradeModal data={trade} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
