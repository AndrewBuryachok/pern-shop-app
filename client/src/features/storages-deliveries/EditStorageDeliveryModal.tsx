import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { StorageDelivery } from './storage-delivery.model';
import { useEditStorageDeliveryMutation } from './storages-deliveries.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { EditStorageDeliveryDto } from './storage-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseItem,
  parseSaleAmount,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE, Status } from '../../common/constants';

type Props = IModal<StorageDelivery> & { hasRole: boolean };

export default function EditStorageDeliveryModal({
  data: storageDelivery,
  hasRole,
}: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      storageDeliveryId: storageDelivery.id,
      price: storageDelivery.price,
      card: `${storageDelivery.hire.card.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: (_, values) =>
        storageDelivery.price < values.price &&
        myCard.balance < values.price - storageDelivery.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(storageDelivery.hire.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

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
      <Select
        label={t('columns.card')}
        description={`${
          storageDelivery.price > form.values.price
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(storageDelivery.price - form.values.price)} ${t(
          'constants.currency',
        )}`}
        rightSection={<RefetchAction {...cardsResponse} />}
        data={selectCardsWithBalance(cards)}
        readOnly
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const editStorageDeliveryFactory = (hasRole: boolean) => ({
  open: (storageDelivery: StorageDelivery) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.deliveries'),
      children: (
        <EditStorageDeliveryModal data={storageDelivery} hasRole={hasRole} />
      ),
    }),
  disable: (storageDelivery: StorageDelivery) =>
    storageDelivery.status !== Status.CREATED,
  color: Color.YELLOW,
});

export const editMyStorageDeliveryAction = editStorageDeliveryFactory(false);

export const editUserStorageDeliveryAction = editStorageDeliveryFactory(true);
