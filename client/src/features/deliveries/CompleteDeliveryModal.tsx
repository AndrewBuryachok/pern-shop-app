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
import { parseCard, parseItem, parsePurchaseAmount } from '../../common/utils';
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
      text={t('actions.complete') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...delivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(delivery.executorCard!)}
        readOnly
      />
      {delivery.purchase.good && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.purchase.good} />}
          iconWidth={48}
          value={parseItem(delivery.purchase.good.item)}
          readOnly
        />
      )}
      {delivery.purchase.ware && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.purchase.ware} />}
          iconWidth={48}
          value={parseItem(delivery.purchase.ware.item)}
          readOnly
        />
      )}
      {delivery.purchase.product && (
        <TextInput
          label={t('columns.item')}
          icon={<ThingImage {...delivery.purchase.product} />}
          iconWidth={48}
          value={parseItem(delivery.purchase.product.item)}
          readOnly
        />
      )}
      <Textarea
        label={t('columns.description')}
        value={
          delivery.purchase.good?.description ||
          delivery.purchase.ware?.description ||
          delivery.purchase.product?.description ||
          '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(delivery.purchase)}
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

export const completeDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.deliveries'),
      children: <CompleteDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) => delivery.status !== Status.EXECUTED,
  color: Color.GREEN,
};
