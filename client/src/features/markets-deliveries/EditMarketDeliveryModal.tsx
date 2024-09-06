import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { MarketDelivery } from './market-delivery.model';
import { useEditMarketDeliveryMutation } from './markets-deliveries.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { EditMarketDeliveryDto } from './market-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseCard,
  parseItem,
  parseTradeAmount,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE, Status } from '../../common/constants';

type Props = IModal<MarketDelivery> & { hasRole: boolean };

export default function EditMarketDeliveryModal({
  data: marketDelivery,
  hasRole,
}: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      marketDeliveryId: marketDelivery.id,
      price: marketDelivery.price,
      card: `${marketDelivery.hire.card.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: (_, values) =>
        marketDelivery.price < values.price &&
        myCard.balance < values.price - marketDelivery.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(marketDelivery.hire.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [editMarketDelivery, { isLoading }] = useEditMarketDeliveryMutation();

  const handleSubmit = async (dto: EditMarketDeliveryDto) => {
    await editMarketDelivery(dto);
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
        icon={<CustomAvatar {...marketDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(marketDelivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...marketDelivery.trade.ware} />}
        iconWidth={48}
        value={parseItem(marketDelivery.trade.ware.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={marketDelivery.trade.ware.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseTradeAmount(marketDelivery.trade)}
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
          marketDelivery.price > form.values.price
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(marketDelivery.price - form.values.price)} ${t(
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

export const editMarketDeliveryFactory = (hasRole: boolean) => ({
  open: (marketDelivery: MarketDelivery) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.deliveries'),
      children: (
        <EditMarketDeliveryModal data={marketDelivery} hasRole={hasRole} />
      ),
    }),
  disable: (marketDelivery: MarketDelivery) =>
    marketDelivery.status !== Status.CREATED,
  color: Color.YELLOW,
});

export const editMyMarketDeliveryAction = editMarketDeliveryFactory(false);

export const editUserMarketDeliveryAction = editMarketDeliveryFactory(true);
