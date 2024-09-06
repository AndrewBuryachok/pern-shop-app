import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import { useEditShopDeliveryMutation } from './shops-deliveries.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { EditShopDeliveryDto } from './shop-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import {
  parseBargainAmount,
  parseCard,
  parseItem,
  selectCardsWithBalance,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE, Status } from '../../common/constants';

type Props = IModal<ShopDelivery> & { hasRole: boolean };

export default function EditShopDeliveryModal({
  data: shopDelivery,
  hasRole,
}: Props) {
  const [t] = useTranslation();

  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      shopDeliveryId: shopDelivery.id,
      price: shopDelivery.price,
      card: `${shopDelivery.hire.card.id}`,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest }),
    validate: {
      card: (_, values) =>
        shopDelivery.price < values.price &&
        myCard.balance < values.price - shopDelivery.price
          ? t('errors.not_enough_balance')
          : null,
    },
  });

  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(shopDelivery.hire.card.user.id)
    : useSelectMyCardsQuery();

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [editShopDelivery, { isLoading }] = useEditShopDeliveryMutation();

  const handleSubmit = async (dto: EditShopDeliveryDto) => {
    await editShopDelivery(dto);
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
        icon={<CustomAvatar {...shopDelivery.hire.card.user} />}
        iconWidth={48}
        value={parseCard(shopDelivery.hire.card)}
        readOnly
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...shopDelivery.bargain.good} />}
        iconWidth={48}
        value={parseItem(shopDelivery.bargain.good.item)}
        readOnly
      />
      <Textarea
        label={t('columns.description')}
        value={shopDelivery.bargain.good.description || '-'}
        readOnly
      />
      <TextInput
        label={t('columns.amount')}
        value={parseBargainAmount(shopDelivery.bargain)}
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
          shopDelivery.price > form.values.price
            ? t('information.increase')
            : t('information.decrease')
        } ${Math.abs(shopDelivery.price - form.values.price)} ${t(
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

export const editShopDeliveryFactory = (hasRole: boolean) => ({
  open: (shopDelivery: ShopDelivery) =>
    openModal({
      title: t('actions.edit') + ' ' + t('modals.deliveries'),
      children: <EditShopDeliveryModal data={shopDelivery} hasRole={hasRole} />,
    }),
  disable: (shopDelivery: ShopDelivery) =>
    shopDelivery.status !== Status.CREATED,
  color: Color.YELLOW,
});

export const editMyShopDeliveryAction = editShopDeliveryFactory(false);

export const editUserShopDeliveryAction = editShopDeliveryFactory(true);
