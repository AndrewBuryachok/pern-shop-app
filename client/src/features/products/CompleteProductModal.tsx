import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Product } from './product.model';
import { useCompleteProductMutation } from './products.api';
import { CompleteProductDto } from './product.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Product>;

export default function CompleteProductModal({ data: product }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      productId: product.id,
    },
  });

  const [completeProduct, { isLoading }] = useCompleteProductMutation();

  const handleSubmit = async (dto: CompleteProductDto) => {
    await completeProduct(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.product')}
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
      <TextInput
        label={t('columns.price')}
        value={`${product.price}$`}
        disabled
      />
    </CustomForm>
  );
}

export const completeProductFactory = (hasRole: boolean) => ({
  open: (product: Product) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.product'),
      children: <CompleteProductModal data={product} />,
    }),
  disable: (product: Product) => !!product.completedAt,
  color: hasRole ? Color.RED : Color.GREEN,
});

export const completeMyProductAction = completeProductFactory(false);

export const completeUserProductAction = completeProductFactory(true);
