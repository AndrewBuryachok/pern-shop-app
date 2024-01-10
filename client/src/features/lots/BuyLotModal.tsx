import { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Lot } from './lot.model';
import { useCreateBidMutation } from '../bids/bids.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateBidDto } from '../bids/bid.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import ThingImage from '../../common/components/ThingImage';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  parseCard,
  parseItem,
  parseThingAmount,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color, MAX_PRICE_VALUE } from '../../common/constants';

type Props = IModal<Lot> & { hasRole: boolean };

export default function BuyLotModal({ data: lot, hasRole }: Props) {
  const [t] = useTranslation();

  const form = useForm({
    initialValues: {
      lotId: lot.id,
      user: '',
      card: '',
      price: lot.price + 1,
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
  });

  const { data: users, ...usersResponse } = useSelectAllUsersQuery(undefined, {
    skip: !hasRole,
  });
  const { data: cards, ...cardsResponse } = hasRole
    ? useSelectUserCardsWithBalanceQuery(+form.values.user, {
        skip: !form.values.user,
      })
    : useSelectMyCardsQuery();

  const user = users?.find((user) => user.id === +form.values.user);
  const card = cards?.find((card) => card.id === +form.values.card);
  const maxPrice = card?.balance;

  const [createBid, { isLoading }] = useCreateBidMutation();

  const handleSubmit = async (dto: CreateBidDto) => {
    await createBid(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={t('actions.buy') + ' ' + t('modals.lots')}
    >
      <TextInput
        label={t('columns.seller')}
        icon={<CustomAvatar {...lot.lease.card.user} />}
        iconWidth={48}
        value={parseCard(lot.lease.card)}
        disabled
      />
      <TextInput
        label={t('columns.item')}
        icon={<ThingImage {...lot} />}
        iconWidth={48}
        value={parseItem(lot.item)}
        disabled
      />
      <Textarea
        label={t('columns.description')}
        value={lot.description || '-'}
        disabled
      />
      <TextInput
        label={t('columns.amount')}
        value={parseThingAmount(lot)}
        disabled
      />
      <TextInput
        label={t('columns.price')}
        value={`${lot.price} ${t('constants.currency')}`}
        disabled
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
          disabled={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <Select
        label={t('columns.card')}
        placeholder={t('columns.card')}
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        limit={20}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
      <NumberInput
        label={t('columns.price')}
        placeholder={t('columns.price')}
        required
        min={lot.price + 1}
        max={customMin(MAX_PRICE_VALUE, maxPrice)}
        {...form.getInputProps('price')}
      />
    </CustomForm>
  );
}

export const buyLotFactory = (hasRole: boolean) => ({
  open: (lot: Lot) =>
    openModal({
      title: t('actions.buy') + ' ' + t('modals.lots'),
      children: <BuyLotModal data={lot} hasRole={hasRole} />,
    }),
  disable: () => false,
  color: Color.GREEN,
});

export const buyMyLotAction = buyLotFactory(false);

export const buyUserLotAction = buyLotFactory(true);
