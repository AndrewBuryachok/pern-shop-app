import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import { useDeleteShopDeliveryMutation } from './shops-deliveries.api';
import { ShopDeliveryIdDto } from './shop-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseBargainAmount, parseCard, parseItem } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<ShopDelivery>;

export default function DeleteShopDeliveryModal({ data: shopDelivery }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      shopDeliveryId: shopDelivery.id,
    },
  });

  const [deleteShopDelivery, { isLoading }] = useDeleteShopDeliveryMutation();

  const handleSubmit = async (dto: ShopDeliveryIdDto) => {
    await deleteShopDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.customer')}
        description={`${t('information.increase')} ${shopDelivery.price} ${t(
          'constants.currency',
        )}`}
        icon={<CustomAvatar {...shopDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(shopDelivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...shopDelivery.bargain.good} />}
        iconWidth={48}
        value={parseItem(shopDelivery.bargain.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={shopDelivery.bargain.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseBargainAmount(shopDelivery.bargain)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${shopDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const deleteShopDeliveryAction = {
  open: (shopDelivery: ShopDelivery) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.deliveries'),
      children: <DeleteShopDeliveryModal data={shopDelivery} />,
    }),
  disable: (shopDelivery: ShopDelivery) =>
    shopDelivery.status !== Status.CREATED,
  color: Color.RED,
};
