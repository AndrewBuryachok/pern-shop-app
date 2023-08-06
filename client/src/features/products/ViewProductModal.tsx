import {
  Input,
  Rating,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
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

type Props = IModal<Product>;

export default function ViewProductModal({ data: product }: Props) {
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
      <Select
        label='Prices'
        placeholder={`Total: ${product.states.length}`}
        itemComponent={StatesItem}
        data={viewStates(product.states)}
        searchable
      />
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
        value={parseTime(product.createdAt)}
        disabled
      />
      <Input.Wrapper label='Rate'>
        <Rating value={product.rate} readOnly />
      </Input.Wrapper>
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
