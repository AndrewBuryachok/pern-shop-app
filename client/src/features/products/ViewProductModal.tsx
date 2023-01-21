import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import {
  parseCard,
  parseCell,
  parseDate,
  parseThingAmount,
} from '../../common/utils';
import { Color, items } from '../../common/constants';

type Props = IModal<Product>;

export default function ViewProductModal({ data: product }: Props) {
  const created = parseDate(product.createdAt);

  return (
    <Stack spacing={8}>
      <TextInput label='Seller' value={parseCard(product.card)} disabled />
      <TextInput
        label='Item'
        value={items[product.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={product.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(product)} disabled />
      <TextInput label='Price' value={`${product.price}$`} disabled />
      <TextInput label='Storage' value={parseCell(product.cell)} disabled />
      <TextInput
        label='Created'
        value={`${created.date} ${created.time}`}
        disabled
      />
    </Stack>
  );
}

export const viewProductAction = {
  open: (product: Product) =>
    openModal({
      title: 'View Product',
      children: <ViewProductModal data={product} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
