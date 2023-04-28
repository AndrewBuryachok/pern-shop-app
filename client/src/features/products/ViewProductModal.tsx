import { Stack, Textarea, TextInput } from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
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
      <TextInput
        label='Seller'
        icon={<CustomAvatar {...product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.card)}
        disabled
      />
      <TextInput
        label='Item'
        icon={<ThingImage {...product} />}
        iconWidth={48}
        value={items[product.item - 1].substring(3)}
        disabled
      />
      <Textarea label='Description' value={product.description} disabled />
      <TextInput label='Amount' value={parseThingAmount(product)} disabled />
      <TextInput label='Price' value={`${product.price}$`} disabled />
      <TextInput
        label='Storage'
        value={parseCell(product.lease.cell)}
        disabled
      />
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...product.lease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.cell.storage.card)}
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

export const viewProductAction = {
  open: (product: Product) =>
    openModal({
      title: 'View Product',
      children: <ViewProductModal data={product} />,
    }),
  disable: () => false,
  color: Color.BLUE,
};
