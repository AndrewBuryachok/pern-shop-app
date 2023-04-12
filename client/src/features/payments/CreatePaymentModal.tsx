import { useEffect } from 'react';
import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreatePaymentMutation } from './payments.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { useSelectUserCardsQuery } from '../cards/cards.api';
import { CreatePaymentDto } from './payment.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import {
  customMin,
  selectCards,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { MAX_DESCRIPTION_LENGTH, MAX_SUM_VALUE } from '../../common/constants';

export default function CreatePaymentModal() {
  const form = useForm({
    initialValues: {
      senderCard: '',
      user: '',
      receiverCard: '',
      sum: 1,
      description: '-',
    },
    transformValues: ({ senderCard, receiverCard, ...rest }) => ({
      ...rest,
      senderCardId: +senderCard,
      receiverCardId: +receiverCard,
    }),
  });

  useEffect(() => form.setFieldValue('receiverCard', ''), [form.values.user]);

  const { data: myCards, ...myCardsResponse } = useSelectMyCardsQuery();
  const { data: users, ...usersResponse } = useSelectAllUsersQuery();
  const { data: cards, ...cardsResponse } = useSelectUserCardsQuery(
    +form.values.user,
    { skip: !form.values.user },
  );

  const user = users?.find((user) => user.id === +form.values.user);
  const card = myCards?.find((card) => card.id === +form.values.senderCard);
  const maxSum = card?.balance;

  const [createPayment, { isLoading }] = useCreatePaymentMutation();

  const handleSubmit = async (dto: CreatePaymentDto) => {
    await createPayment(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create payment'}
    >
      <Select
        label='Sender Card'
        placeholder='Sender Card'
        rightSection={<RefetchAction {...myCardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(myCards)}
        searchable
        required
        disabled={myCardsResponse.isFetching}
        {...form.getInputProps('senderCard')}
      />
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
      <Select
        label='Receiver Card'
        placeholder='Receiver Card'
        rightSection={
          <RefetchAction {...cardsResponse} skip={!form.values.user} />
        }
        itemComponent={CardsItem}
        data={selectCards(cards)}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('receiverCard')}
      />
      <NumberInput
        label='Sum'
        placeholder='Sum'
        required
        min={1}
        max={customMin(MAX_SUM_VALUE, maxSum)}
        {...form.getInputProps('sum')}
      />
      <Textarea
        label='Description'
        placeholder='Description'
        required
        maxLength={MAX_DESCRIPTION_LENGTH}
        {...form.getInputProps('description')}
      />
    </CustomForm>
  );
}

export const createPaymentButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Payment',
      children: <CreatePaymentModal />,
    }),
};
