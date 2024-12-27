import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
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
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseItem,
  parsePurchaseAmount,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE, Status } from '../../common/constants';

type Props = IModal<Delivery> & { hasRole: boolean };

export default function EditDeliveryModal({ data: delivery, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
      price: delivery.price,
      card: `${delivery.hire.card.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: (_, values) =>
        delivery.price < values.price &&
        myCard.balance < values.price - delivery.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(delivery.hire.card.user.id)
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
      <TextInput
        label={t('columns.customer')}
        icon={<CustomAvatar {...delivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(delivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...delivery.purchase.good} />}
        iconWidth={48}
        value={parseItem(delivery.purchase.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={delivery.purchase.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parsePurchaseAmount(delivery.purchase)}
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
