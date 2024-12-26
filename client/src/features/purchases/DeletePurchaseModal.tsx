import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Purchase } from './purchase.model';
import { useDeletePurchaseMutation } from './purchases.api';
import { PurchaseIdDto } from './purchase.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parsePurchaseAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Purchase>;

export default function DeletePurchaseModal({ data: purchase }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      purchaseId: purchase.id,
    },
  });

  const [deletePurchase, { isLoading }] = useDeletePurchaseMutation();

  const handleSubmit = async (dto: PurchaseIdDto) => {
    await deletePurchase(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.purchases')}
    >
      <TextInput
        label={t('columns.buyer')}
        icon={<CustomAvatar {...purchase.card.user} />}
        iconWidth={48}
        value={parseCard(purchase.card)}
        readOnly
      />
      {purchase.good && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...purchase.good} />}
          iconWidth={48}
          value={parseItem(purchase.good.item)}
          readOnly
        />
      )}
      {purchase.ware && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...purchase.ware} />}
          iconWidth={48}
          value={parseItem(purchase.ware.item)}
          readOnly
        />
      )}
      {purchase.product && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...purchase.product} />}
          iconWidth={48}
          value={parseItem(purchase.product.item)}
          readOnly
        />
      )}
      <Textarea
        label={t('columns.description')}
        value={
          purchase.good?.description ||
          purchase.ware?.description ||
          purchase.product?.description ||
          '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(purchase)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${
          purchase.amount *
          (purchase.good?.price ||
            purchase.ware?.price ||
            purchase.product?.price ||
            0)
        } ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deletePurchaseAction = {
  open: (purchase: Purchase) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.purchases'),
      children: <DeletePurchaseModal data={purchase} />,
    }),
  disable: () => false,
  color: Color.RED,
};
