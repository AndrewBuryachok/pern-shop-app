import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Order } from './order.model';
import { useEditOrderMutation } from './orders.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { EditOrderDto } from './order.dto';
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

type Props = IModal<Order> & { hasRole: boolean };

export default function EditOrderModal({ data: order, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      orderId: order.id,
      item: `${order.item}`,
      description: order.description,
      amount: order.amount,
      intake: order.intake,
      kit: `${order.kit}`,
      price: order.price,
      card: `${order.hire.card.id}`,
    },
    transformValues: ({ item, kit, card, ...rest }) => ({
      ...rest,
      item: +item,
      kit: +kit,
    }),
    validate: {
      card: (_, values) =>
        order.price < values.price &&
        myCard.balance < values.price - order.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(order.hire.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.account.balance || 0;

  const [editOrder, { isLoading }] = useEditOrderMutation();

  const handleSubmit = async (dto: EditOrderDto) => {
    await editOrder(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.edit') + ' ' + t('modals.orders')}
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
          order.price > form.values.price
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(order.price - form.values.price)} ${t(
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

export const editOrderFactory = (hasRole: boolean) => ({
  open: (order: Order) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.orders'),
      children: <EditOrderModal data={order} hasRole={hasRole} />,
    }),
  disable: (order: Order) => order.status !== Status.CREATED,
  color: Color.YELLOW,
});

export const editMyOrderAction = editOrderFactory(false);

export const editUserOrderAction = editOrderFactory(true);
