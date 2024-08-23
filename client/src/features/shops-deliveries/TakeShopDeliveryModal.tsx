import { t } from 'i18next';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { ShopDelivery } from './shop-delivery.model';
import { useTakeShopDeliveryMutation } from './shops-deliveries.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { TakeShopDeliveryDto } from './shop-delivery.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseBargainAmount,
  parseCard,
  parseItem,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color, Status } from '../../common/constants';

type Props = IModal<ShopDelivery> & { hasRole: boolean };

export default function TakeShopDeliveryModal({
  data: shopDelivery,
  hasRole,
}: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      shopDeliveryId: shopDelivery.id,
      user: '',
      card: '',
    },
    transformValues: ({ user, card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);

  const [takeShopDelivery, { isLoading }] = useTakeShopDeliveryMutation();

  const handleSubmit = async (dto: TakeShopDeliveryDto) => {
    await takeShopDelivery(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.take') + ' ' + t('modals.deliveries')}
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
      <TextInput
        label={t('columns.price')}
        value={`${shopDelivery.price} ${t('constants.currency')}`}
        readOnly
      />
      {hasRole && (
        <Select
          label={t('columns.user')}
          placeholder={t('columns.user')}
          icon={user && <CustomAvatar {...user} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          limit={20}
          searchable
          required
          readOnly={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={
          <RefetchAction
            {...cardsResponse}
            skip={!form.values.user && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        readOnly={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const takeShopDeliveryFactory = (hasRole: boolean) => ({
  open: (shopDelivery: ShopDelivery) =>
    openModal({
      title: t('actions.take') + ' ' + t('modals.deliveries'),
      children: <TakeShopDeliveryModal data={shopDelivery} hasRole={hasRole} />,
    }),
  disable: (shopDelivery: ShopDelivery) =>
    shopDelivery.status !== Status.CREATED,
  color: Color.GREEN,
});

export const takeMyShopDeliveryAction = takeShopDeliveryFactory(false);

export const takeUserShopDeliveryAction = takeShopDeliveryFactory(true);
