import { NumberInput, Select, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import { useEditProductMutation } from './products.api';
import { EditProductDto } from './product.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { StatesItem } from '../../common/components/StatesItem';
import {
  parseCard,
  parseCell,
  parseThingAmount,
  parseTime,
  viewStates,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE, items } from '../../common/constants';

type Props = IModal<Product>;

export default function EditProductModal({ data: product }: Props) {
  const form = useForm({
    initialValues: {
      productId: product.id,
      price: product.price,
    },
  });

  const [editProduct, { isLoading }] = useEditProductMutation();

  const handleSubmit = async (dto: EditProductDto) => {
    await editProduct(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Edit product'}
      isChanged={!form.isDirty()}
    >
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
      <NumberInput
        label='Price'
        placeholder='Price'
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
      <Select
        label='Prices'
        placeholder={`Total: ${product.states.length}`}
        itemComponent={StatesItem}
        data={viewStates(product.states)}
        searchable
      />
      <TextInput
        label='Market'
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
    </CustomForm>
  );
}

export const editProductAction = {
  open: (product: Product) =>
    openModal({
      title: 'Edit Product',
      children: <EditProductModal data={product} />,
    }),
  disable: (product: Product) => !product.amount,
  color: Color.YELLOW,
};
