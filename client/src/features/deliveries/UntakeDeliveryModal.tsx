import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useUntakeDeliveryMutation } from './deliveries.api';
import { DeliveryIdDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Delivery>;

export default function UntakeDeliveryModal({ data: delivery }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
    },
  });

  const [untakeDelivery, { isLoading }] = useUntakeDeliveryMutation();

  const handleSubmit = async (dto: DeliveryIdDto) => {
    await untakeDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.untake') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...delivery.fromLease.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromLease.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...delivery} />}
        iconWidth={48}
        value={parseItem(delivery.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={delivery.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(delivery)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${delivery.price} ${t('constants.currency')}`}
        readOnly
      />
    </CustomForm>
  );
}

export const untakeDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.untake') + ' ' + t('modals.deliveries'),
      children: <UntakeDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) => delivery.status !== Status.TAKEN,
  color: Color.RED,
};
