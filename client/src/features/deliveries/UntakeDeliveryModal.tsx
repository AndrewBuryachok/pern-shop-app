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
import { parseCard, parseItem, parsePurchaseAmount } from '../../common/utils';
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
        icon={<CustomAvatar {...delivery.customerCard.user} />}
        iconWidth={48}
        value={parseCard(delivery.customerCard)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...delivery.purchase.good} />}
        iconWidth={48}
        value={parseItem(delivery.purchase.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={delivery.purchase.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(delivery.purchase)}
        readOnly
      />
      <TextInput
        label={t('columns.sum')}
        value={`${delivery.sum} ${t('constants.currency')}`}
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
