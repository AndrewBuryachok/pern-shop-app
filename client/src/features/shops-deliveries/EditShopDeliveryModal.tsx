import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import { useEditShopDeliveryMutation } from './shops-deliveries.api';
import { EditShopDeliveryDto } from './shop-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseBargainAmount, parseCard, parseItem } from '../../common/utils';
import { Color, MAX_PRICE_VALUE, Status } from '../../common/constants';

type Props = IModal<ShopDelivery>;

export default function EditShopDeliveryModal({ data: shopDelivery }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      shopDeliveryId: shopDelivery.id,
      price: shopDelivery.price,
    },
  });

  const [editShopDelivery, { isLoading }] = useEditShopDeliveryMutation();

  const handleSubmit = async (dto: EditShopDeliveryDto) => {
    await editShopDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.deliveries')}
      isChanged={!form.isDirty()}
    >
      <TextInput
        label={t('columns.customer')}
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

export const editShopDeliveryAction = {
  open: (shopDelivery: ShopDelivery) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.deliveries'),
      children: <EditShopDeliveryModal data={shopDelivery} />,
    }),
  disable: (shopDelivery: ShopDelivery) =>
    shopDelivery.status !== Status.CREATED,
  color: Color.YELLOW,
};
