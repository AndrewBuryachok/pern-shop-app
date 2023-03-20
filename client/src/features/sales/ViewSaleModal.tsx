import { Stack, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Sale } from './sale.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseDate,
  parseSaleAmount,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Sale>;

export default function ViewSaleModal({ data: sale }: Props) {
  const created = parseDate(sale.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput
        label='Buyer'
        icon={<CustomAvatar {...sale.card.user} />}
        iconWidth={48}
        value={parseCard(sale.card)}
        disabled
      />
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...sale.product.card.user} />}
        iconWidth={48}
        value={parseCard(sale.product.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...sale.product} />}
        iconWidth={48}
        value={items[sale.product.item - 1].substring(3)}
        disabled
      />
      <TextInput
        label='Description'
        value={sale.product.description}
        disabled
      />
      <TextInput label='Amount' value={parseSaleAmount(sale)} disabled />
      <TextInput
        label='Sum'
        value={`${sale.amount * sale.product.price}$`}
        disabled
      />
      <TextInput
        label='Storage'
        value={parseCell(sale.product.cell)}
        disabled
      />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
    </Stack>
  );
}

export const viewSaleAction = {
  open: (sale: Sale) =>
    openModal({
      title: 'View Sale',
      children: <ViewSaleModal data={sale} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
