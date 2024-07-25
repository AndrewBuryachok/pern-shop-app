import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Input, Rating, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageDelivery } from './storage-delivery.model';
import { useRateStorageDeliveryMutation } from './storages-deliveries.api';
import { RateStorageDeliveryDto } from './storage-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseSaleAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<StorageDelivery>;

export default function RateStorageDeliveryModal({
  data: storageDelivery,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      storageDeliveryId: storageDelivery.id,
      rate: 5,
    },
  });

  const [rateStorageDelivery, { isLoading }] = useRateStorageDeliveryMutation();

  const handleSubmit = async (dto: RateStorageDeliveryDto) => {
    await rateStorageDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.rate') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.executor')}
        icon={
          storageDelivery.executorCard && (
            <CustomAvatar {...storageDelivery.executorCard.user} />
          )
        }
        iconWidth={48}
        value={
          storageDelivery.executorCard
            ? parseCard(storageDelivery.executorCard)
            : '-'
        }
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...storageDelivery.sale.product} />}
        iconWidth={48}
        value={parseItem(storageDelivery.sale.product.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={storageDelivery.sale.product.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseSaleAmount(storageDelivery.sale)}
        readOnly
      />
      <TextInput
        label={t('columns.price')}
        value={`${storageDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
      <Input.Wrapper label={t('columns.rate')} required>
        <Rating {...form.getInputProps('rate')} />
      </Input.Wrapper>
    </CustomForm>
  );
}

export const rateStorageDeliveryAction = {
  open: (storageDelivery: StorageDelivery) =>
    openModal({
      title: t('actions.rate') + ' ' + t('modals.deliveries'),
      children: <RateStorageDeliveryModal data={storageDelivery} />,
    }),
  disable: (storageDelivery: StorageDelivery) =>
    storageDelivery.status !== Status.COMPLETED || !!storageDelivery.rate,
  color: Color.YELLOW,
};
