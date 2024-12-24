import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useRateDeliveryMutation } from './deliveries.api';
import { RateDeliveryDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseBargainAmount,
  parseCard,
  parseItem,
  parseSaleAmount,
  parseTradeAmount,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Delivery>;

export default function RateDeliveryModal({ data: delivery }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
      rate: 5,
    },
  });

  const [rateDelivery, { isLoading }] = useRateDeliveryMutation();

  const handleSubmit = async (dto: RateDeliveryDto) => {
    await rateDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...delivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(delivery.executorCard!)}
        readOnly
      />
      {delivery.bargain && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.bargain.good} />}
          iconWidth={48}
          value={parseItem(delivery.bargain.good.item)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.trade.ware} />}
          iconWidth={48}
          value={parseItem(delivery.trade.ware.item)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.sale.product} />}
          iconWidth={48}
          value={parseItem(delivery.sale.product.item)}
          readOnly
        />
      )}
      <Textarea
        label={t('columns.description')}
        value={
          delivery.bargain?.good.description ||
          delivery.trade?.ware.description ||
          delivery.sale?.product.description ||
          '-'
        }
        readOnly
      />
      {delivery.bargain && (
        <TextInput
          label={t('columns.amount')}
          value={parseBargainAmount(delivery.bargain)}
          readOnly
        />
      )}
      {delivery.trade && (
        <TextInput
          label={t('columns.amount')}
          value={parseTradeAmount(delivery.trade)}
          readOnly
        />
      )}
      {delivery.sale && (
        <TextInput
          label={t('columns.amount')}
          value={parseSaleAmount(delivery.sale)}
          readOnly
        />
      )}
      <TextInput
        label={t('columns.price')}
        value={`${delivery.price} ${t('constants.currency')}`}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.deliveries'),
      children: <RateDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) =>
    delivery.status !== Status.COMPLETED || !!delivery.rate,
  color: Color.YELLOW,
};
