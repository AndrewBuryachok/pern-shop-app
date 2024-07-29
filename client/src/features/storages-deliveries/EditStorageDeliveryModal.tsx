import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageDelivery } from './storage-delivery.model';
import { useEditStorageDeliveryMutation } from './storages-deliveries.api';
import { EditStorageDeliveryDto } from './storage-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { parseCard, parseItem, parseSaleAmount } from '../../common/utils';
import { Color, MAX_PRICE_VALUE, Status } from '../../common/constants';

type Props = IModal<StorageDelivery>;

export default function EditStorageDeliveryModal({
  data: storageDelivery,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      storageDeliveryId: storageDelivery.id,
      price: storageDelivery.price,
    },
  });

  const [editStorageDelivery, { isLoading }] = useEditStorageDeliveryMutation();

  const handleSubmit = async (dto: EditStorageDeliveryDto) => {
    await editStorageDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.deliveries')}
      isChanged={!form.isDirty()}
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
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={1}
        max={MAX_PRICE_VALUE}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const editStorageDeliveryAction = {
  open: (storageDelivery: StorageDelivery) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.deliveries'),
      children: <EditStorageDeliveryModal data={storageDelivery} />,
    }),
  disable: (storageDelivery: StorageDelivery) =>
    storageDelivery.status !== Status.CREATED,
  color: Color.YELLOW,
};
