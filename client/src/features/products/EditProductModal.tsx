import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import { useEditProductMutation } from './products.api';
import { EditProductDto } from './product.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import {
  Color,
  MAX_AMOUNT_VALUE,
  MAX_PRICE_VALUE,
} from '../../common/constants';

type Props = IModal<Product>;

export default function EditProductModal({ data: product }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      productId: product.id,
      amount: product.amount,
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
      text={t('actions.edit') + ' ' + t('modals.product')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...product.lease.card.user} />}
        iconWidth={48}
        value={parseCard(product.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...product} />}
        iconWidth={48}
        value={parseItem(product.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={product.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(product)}
        disabled
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editProductAction = {
  open: (product: Product) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.product'),
      children: <EditProductModal data={product} />,
    }),
  disable: (product: Product) => !!product.completedAt,
  color: Color.YELLOW,
};
