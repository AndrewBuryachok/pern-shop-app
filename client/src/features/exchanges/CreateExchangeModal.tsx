import { NativeSelect, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateExchangeMutation } from './exchanges.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { useSelectUserCardsWithBalanceQuery } from '../cards/cards.api';
import { CreateExchangeDto } from './exchange.dto';
import CustomForm from '../../common/components/CustomForm';
import {
  customMin,
  selectCardsWithBalance,
  selectUsers,
} from '../../common/utils';
import { MAX_SUM_VALUE } from '../../common/constants';

export default function CreateExchangeModal() {
  const form = useForm({
    initialValues: {
      user: '',
      card: '',
      type: '1',
      sum: 1,
    },
    transformValues: ({ user, card, type, ...rest }) => ({
      ...rest,
      type: !!+type,
      userId: +user,
      cardId: +card,
    }),
  });

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
      <NativeSelect
        label='User'
        data={selectUsers(users)}
        required
        {...form.getInputProps('user')}
      />
      <NativeSelect
        label='Card'
        data={selectCardsWithBalance(cards)}
        required
        {...form.getInputProps('card')}
      />
      <NativeSelect
        label='Type'
        data={[
          { value: '', label: '' },
          { value: '1', label: 'increase' },
          { value: '0', label: 'reduce' },
        ]}
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
