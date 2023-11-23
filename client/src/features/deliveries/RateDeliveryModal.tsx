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
import { parseCard, parseItem, parseThingAmount } from '../../common/utils';
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
      text={t('actions.rate') + ' ' + t('modals.delivery')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={<CustomAvatar {...delivery.executorCard!.user} />}
        iconWidth={48}
        value={parseCard(delivery.executorCard!)}
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
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateDeliveryAction = {
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.delivery'),
      children: <RateDeliveryModal data={delivery} />,
    }),
  disable: (delivery: Delivery) =>
    delivery.status !== Status.COMPLETED || !!delivery.rate,
  color: Color.YELLOW,
};
