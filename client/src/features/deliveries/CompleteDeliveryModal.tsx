import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useCompleteDeliveryMutation } from './deliveries.api';
import { DeliveryIdDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseCell,
  parseItem,
  parseThingAmount,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<Delivery>;

export default function CompleteDeliveryModal({ data: delivery }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
    },
  });

  const [completeDelivery, { isLoading }] = useCompleteDeliveryMutation();

  const handleSubmit = async (dto: DeliveryIdDto) => {
    await completeDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.delivery')}
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
        value={delivery.description}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(delivery)}
        disabled
      />
      <TextInput
        label={t('columns.price')}
        value={`${delivery.price}$`}
        disabled
      />
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...delivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(delivery.executorCard!)}
        disabled
      />
      <TextInput
        label={t('columns.storage') + ' ' + t('columns.from')}
        value={parseCell(delivery.fromLease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.owner') + ' ' + t('columns.from')}
        icon={<CustomAvatar {...delivery.fromLease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.fromLease.cell.storage.card)}
        disabled
      />
      <TextInput
        label={t('columns.storage') + ' ' + t('columns.to')}
        value={parseCell(delivery.toLease.cell)}
        disabled
      />
      <TextInput
        label={t('columns.owner') + ' ' + t('columns.to')}
        icon={<CustomAvatar {...delivery.toLease.cell.storage.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.toLease.cell.storage.card)}
        disabled
      />
    </CustomForm>
  );
}

export const completeDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.delivery'),
      children: <CompleteDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) => delivery.status !== Status.EXECUTED,
  color: Color.GREEN,
};
