import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import { useRateShopDeliveryMutation } from './shops-deliveries.api';
import { RateShopDeliveryDto } from './shop-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseBargainAmount, parseCard, parseItem } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<ShopDelivery>;

export default function RateShopDeliveryModal({ data: shopDelivery }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      shopDeliveryId: shopDelivery.id,
      rate: 5,
    },
  });

  const [rateShopDelivery, { isLoading }] = useRateShopDeliveryMutation();

  const handleSubmit = async (dto: RateShopDeliveryDto) => {
    await rateShopDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...shopDelivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(shopDelivery.executorCard!)}
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
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateShopDeliveryAction = {
  open: (shopDelivery: ShopDelivery) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.deliveries'),
      children: <RateShopDeliveryModal data={shopDelivery} />,
    }),
  disable: (shopDelivery: ShopDelivery) =>
    shopDelivery.status !== Status.COMPLETED || !!shopDelivery.rate,
  color: Color.YELLOW,
};
