import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageDelivery } from './storage-delivery.model';
import { useCompleteStorageDeliveryMutation } from './storages-deliveries.api';
import { StorageDeliveryIdDto } from './storage-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseSaleAmount } from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<StorageDelivery>;

export default function CompleteStorageDeliveryModal({
  data: storageDelivery,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      storageDeliveryId: storageDelivery.id,
    },
  });

  const [completeStorageDelivery, { isLoading }] =
    useCompleteStorageDeliveryMutation();

  const handleSubmit = async (dto: StorageDeliveryIdDto) => {
    await completeStorageDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.complete') + ' ' + t('modals.deliveries')}
    >
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...storageDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(storageDelivery.hire.card)}
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
    </CustomForm>
  );
}

export const completeStorageDeliveryAction = {
  open: (storageDelivery: StorageDelivery) =>
    openModal({
      title: t('actions.complete') + ' ' + t('modals.deliveries'),
      children: <CompleteStorageDeliveryModal data={storageDelivery} />,
    }),
  disable: (storageDelivery: StorageDelivery) =>
    storageDelivery.status !== Status.EXECUTED,
  color: Color.GREEN,
};
