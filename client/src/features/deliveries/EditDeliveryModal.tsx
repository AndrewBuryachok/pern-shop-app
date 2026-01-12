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
import { Color, MAX_SUM_VALUE, Status } from '../../common/constants';

type Props = IModal<Delivery> & { hasRole: boolean };

export default function EditDeliveryModal({ data: delivery, hasRole }: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      deliveryId: delivery.id,
      sum: delivery.sum,
      card: `${delivery.customerCard.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: (_, values) =>
        delivery.sum < values.sum && myCard.balance < values.sum - delivery.sum
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(delivery.customerCard.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.account.balance || 0;

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
        icon={<CustomAvatar {...delivery.customerCard.user} />}
        iconWidth={48}
        value={parseCard(delivery.customerCard)}
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
        label={t('columns.sum')}
        placeholder={t('columns.sum')}
        required
        min={1}
        max={MAX_SUM_VALUE}
        {...form.getInputProps('sum')}
      />
      <Select
        label={t('columns.card')}
        description={`${
          delivery.sum > form.values.sum
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(delivery.sum - form.values.sum)} ${t(
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
