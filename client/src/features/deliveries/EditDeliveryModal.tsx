import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Delivery } from './delivery.model';
import { useEditDeliveryMutation } from './deliveries.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { EditDeliveryDto } from './delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import ThingImage from '../../common/components/ThingImage';
import { ThingsItem } from '../../common/components/ThingsItem';
import {
  selectCardsWithBalance,
  selectItems,
  selectKits,
} from '../../common/utils';
import {
  Color,
  MAX_AMOUNT_VALUE,
  MAX_DESCRIPTION_LENGTH,
  MAX_INTAKE_VALUE,
  MAX_PRICE_VALUE,
  Status,
} from '../../common/constants';

type Props = IModal<Delivery> & { hasRole: boolean };

export default function EditDeliveryModal({ data: delivery, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
      item: `${delivery.item}`,
      description: delivery.description,
      amount: delivery.amount,
      intake: delivery.intake,
      kit: `${delivery.kit}`,
      price: delivery.price,
      card: `${delivery.fromHire.card.id}`,
    },
    transformValues: ({ item, kit, card, ...rest }) => ({
      ...rest,
      item: +item,
      kit: +kit,
    }),
    validate: {
      card: (_, values) =>
        delivery.price < values.price &&
        myCard.balance < values.price - delivery.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(delivery.fromHire.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [editDelivery, { isLoading }] = useEditDeliveryMutation();

  const handleSubmit = async (dto: EditDeliveryDto) => {
    await editDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.deliveries')}
      isChanged={!form.isDirty()}
    >
      <Select
        label={t('columns.item')}
        placeholder={t('columns.item')}
        icon={form.values.item && <ThingImage item={+form.values.item} />}
        iconWidth={48}
        itemComponent={ThingsItem}
        data={selectItems()}
        limit={20}
        searchable
        required
        {...form.getInputProps('item')}
      />
      <Textarea
        label={t('columns.description')}
        placeholder={t('columns.description')}
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
      <NumberInput
        label={t('columns.amount')}
        placeholder={t('columns.amount')}
        required
        min={1}
        max={MAX_AMOUNT_VALUE}
        {...form.getInputProps('amount')}
      />
      <NumberInput
        label={t('columns.intake')}
        placeholder={t('columns.intake')}
        required
        min={1}
        max={MAX_INTAKE_VALUE}
        {...form.getInputProps('intake')}
      />
      <Select
        label={t('columns.kit')}
        placeholder={t('columns.kit')}
        data={selectKits()}
        searchable
        required
        {...form.getInputProps('kit')}
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
          delivery.price > form.values.price
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(delivery.price - form.values.price)} ${t(
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

export const editDeliveryFactory = (hasRole: boolean) => ({
  open: (delivery: Delivery) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.deliveries'),
      children: <EditDeliveryModal data={delivery} hasRole={hasRole} />,
    }),
  disable: (delivery: Delivery) => delivery.status !== Status.CREATED,
  color: Color.YELLOW,
});

export const editMyDeliveryAction = editDeliveryFactory(false);

export const editUserDeliveryAction = editDeliveryFactory(true);
