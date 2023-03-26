import { useEffect } from 'react';
import { NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateExchangeMutation } from './exchanges.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { useSelectUserCardsWithBalanceQuery } from '../cards/cards.api';
import { CreateExchangeDto } from './exchange.dto';
import CustomForm from '../../common/components/CustomForm';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  selectCardsWithBalance,
  selectTypes,
  selectUsers,
} from '../../common/utils';
import { MAX_SUM_VALUE } from '../../common/constants';

export default function CreateExchangeModal() {
  const form = useForm({
    initialValues: {
      user: '',
      card: '',
      type: '',
      sum: 1,
    },
    transformValues: ({ user, card, type, ...rest }) => ({
      ...rest,
      type: !!+type,
      userId: +user,
      cardId: +card,
    }),
  });

  useEffect(() => form.setFieldValue('card', ''), [form.values.user]);

  const { data: users } = useSelectAllUsersQuery();
  const { data: cards } = useSelectUserCardsWithBalanceQuery(
    +form.values.user,
    { skip: !form.values.user },
  );

  const card = cards?.find((card) => card.id === +form.values.card);
  const maxSum = !+form.values.type ? card?.balance : undefined;

  const [createExchange, { isLoading }] = useCreateExchangeMutation();

  const handleSubmit = async (dto: CreateExchangeDto) => {
    await createExchange(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create exchange'}
    >
      <Select
        label='User'
        placeholder='User'
        icon={
          form.values.user && (
            <CustomAvatar
              {...users?.find((user) => user.id === +form.values.user)!}
            />
          )
        }
        iconWidth={48}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        searchable
        required
        {...form.getInputProps('user')}
      />
      <Select
        label='Card'
        placeholder='Card'
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        {...form.getInputProps('card')}
      />
      <Select
        label='Type'
        placeholder='Type'
        data={selectTypes()}
        searchable
        required
        {...form.getInputProps('type')}
      />
      <NumberInput
        label='Sum'
        placeholder='Sum'
        required
        min={1}
        max={customMin(MAX_SUM_VALUE, maxSum)}
        {...form.getInputProps('sum')}
      />
    </CustomForm>
  );
}

export const createExchangeButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Exchange',
      children: <CreateExchangeModal />,
    }),
};
