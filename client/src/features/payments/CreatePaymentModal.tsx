import { NativeSelect, NumberInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreatePaymentMutation } from './payments.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { useSelectUserCardsQuery } from '../cards/cards.api';
import { CreatePaymentDto } from './payment.dto';
import CustomForm from '../../common/components/CustomForm';
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

  const { data: myCards } = useSelectMyCardsQuery();
  const { data: users } = useSelectAllUsersQuery();
  const { data: cards } = useSelectUserCardsQuery(+form.values.user, {
    skip: !form.values.user,
  });

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
      <NativeSelect
        label='Sender Card'
        data={selectCardsWithBalance(myCards)}
        required
        {...form.getInputProps('senderCard')}
      />
      <NativeSelect
        label='User'
        data={selectUsers(users)}
        required
        {...form.getInputProps('user')}
      />
      <NativeSelect
        label='Receiver Card'
        data={selectCards(cards)}
        required
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
