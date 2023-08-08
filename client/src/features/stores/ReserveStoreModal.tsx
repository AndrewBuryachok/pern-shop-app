import { useEffect } from 'react';
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { IModal } from '../../common/interfaces';
import { Store } from './store.model';
import { useCreateRentMutation } from '../rents/rents.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import {
  useSelectMyCardsQuery,
  useSelectUserCardsWithBalanceQuery,
} from '../cards/cards.api';
import { CreateRentDto } from '../rents/rent.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  parseCard,
  parseStore,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { Color } from '../../common/constants';

type Props = IModal<Store> & { hasRole: boolean };

export default function ReserveStoreModal({ data: store, hasRole }: Props) {
  const myCard = { balance: 0 };

  const form = useForm({
    initialValues: {
      storeId: store.id,
      user: '',
      card: '',
    },
    transformValues: ({ card, ...rest }) => ({ ...rest, cardId: +card }),
    validate: {
      card: () =>
        myCard.balance < store.market.price ? 'Not enough balance' : null,
    },
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

  myCard.balance =
    cards?.find((card) => card.id === +form.values.card)?.balance || 0;

  const [createRent, { isLoading }] = useCreateRentMutation();

  const handleSubmit = async (dto: CreateRentDto) => {
    await createRent(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Reserve store'}
    >
      <TextInput
        label='Owner'
        icon={<CustomAvatar {...store.market.card.user} />}
        iconWidth={48}
        value={parseCard(store.market.card)}
        disabled
      />
      <TextInput label='Store' value={parseStore(store)} disabled />
      <TextInput label='Price' value={`${store.market.price}$`} disabled />
      {hasRole && (
        <Select
          label='User'
          placeholder='User'
          icon={user && <CustomAvatar {...user} />}
          iconWidth={48}
          rightSection={<RefetchAction {...usersResponse} />}
          itemComponent={UsersItem}
          data={selectUsers(users)}
          searchable
          required
          disabled={usersResponse.isFetching}
          {...form.getInputProps('user')}
        />
      )}
      <Select
        label='Card'
        placeholder='Card'
        rightSection={
          <RefetchAction
            {...cardsResponse}
            skip={!form.values.user && hasRole}
          />
        }
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('card')}
      />
    </CustomForm>
  );
}

export const reserveStoreFactory = (hasRole: boolean) => ({
  open: (store: Store) =>
    openModal({
      title: 'Reserve Store',
      children: <ReserveStoreModal data={store} hasRole={hasRole} />,
    }),
  disable: () => false,
  color: Color.GREEN,
});

export const reserveMyStoreAction = reserveStoreFactory(false);

export const reserveUserStoreAction = reserveStoreFactory(true);
