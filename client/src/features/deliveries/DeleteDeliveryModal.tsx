import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useDeleteDeliveryMutation } from './deliveries.api';
import { DeliveryIdDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Delivery>;

export default function DeleteDeliveryModal({ data: delivery }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
    },
  });

  const [deleteDelivery, { isLoading }] = useDeleteDeliveryMutation();

  const handleSubmit = async (dto: DeliveryIdDto) => {
    await deleteDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.delete') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...delivery.fromLease.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromLease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...delivery} />}
        iconWidth={48}
        value={parseItem(delivery.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={delivery.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(delivery)}
        disabled
      />
      <TextInput
        label={t('columns.price')}
        value={`${delivery.price} ${t('constants.currency')}`}
        disabled
      />
    </CustomForm>
  );
}

export const deleteDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.delete') + ' ' + t('modals.deliveries'),
      children: <DeleteDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) => delivery.status !== Status.CREATED,
  color: Color.RED,
};
