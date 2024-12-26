import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Purchase } from './purchase.model';
import { useRatePurchaseMutation } from './purchases.api';
import { RatePurchaseDto } from './purchase.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parsePurchaseAmount } from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Purchase>;

export default function RatePurchaseModal({ data: purchase }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      purchaseId: purchase.id,
      rate: 5,
    },
  });

  const [ratePurchase, { isLoading }] = useRatePurchaseMutation();

  const handleSubmit = async (dto: RatePurchaseDto) => {
    await ratePurchase(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.purchases')}
    >
      {purchase.good && (
        <TextInput
          label={t('columns.seller')}
          icon={<CustomAvatar {...purchase.good.shop.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.good.shop.card)}
          readOnly
        />
      )}
      {purchase.ware && (
        <TextInput
          label={t('columns.seller')}
          icon={<CustomAvatar {...purchase.ware.rent.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.ware.rent.card)}
          readOnly
        />
      )}
      {purchase.product && (
        <TextInput
          label={t('columns.seller')}
          icon={<CustomAvatar {...purchase.product.lease.card.user} />}
          iconWidth={48}
          value={parseCard(purchase.product.lease.card)}
          readOnly
        />
      )}
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
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const ratePurchaseAction = {
  open: (purchase: Purchase) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.purchases'),
      children: <RatePurchaseModal data={purchase} />,
    }),
  disable: (purchase: Purchase) => !!purchase.rate,
  color: Color.YELLOW,
};
