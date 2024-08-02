import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Sale } from './sale.model';
import { useDeleteSaleMutation } from './sales.api';
import { DeleteSaleDto } from './sale.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseSaleAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Sale>;

export default function DeleteSaleModal({ data: sale }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      saleId: sale.id,
    },
  });

  const [deleteSale, { isLoading }] = useDeleteSaleMutation();

  const handleSubmit = async (dto: DeleteSaleDto) => {
    await deleteSale(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.sales')}
    >
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...sale.card.user} />}
        iconWidth={48}
        value={parseCard(sale.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...sale.product} />}
        iconWidth={48}
        value={parseItem(sale.product.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={sale.product.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseSaleAmount(sale)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${sale.amount * sale.product.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteSaleAction = {
  open: (sale: Sale) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.sales'),
      children: <DeleteSaleModal data={sale} />,
    }),
  disable: () => false,
  color: Color.RED,
};
