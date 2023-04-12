import { NumberInput, Select, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openModal } from '@mantine/modals';
import { useCreateInvoiceMutation } from './invoices.api';
import { useSelectMyCardsQuery } from '../cards/cards.api';
import { useSelectAllUsersQuery } from '../users/users.api';
import { CreateInvoiceDto } from './invoice.dto';
import CustomForm from '../../common/components/CustomForm';
import RefetchAction from '../../common/components/RefetchAction';
import CustomAvatar from '../../common/components/CustomAvatar';
import { UsersItem } from '../../common/components/UsersItem';
import { CardsItem } from '../../common/components/CardsItem';
import { selectCardsWithBalance, selectUsers } from '../../common/utils';
import { MAX_DESCRIPTION_LENGTH, MAX_SUM_VALUE } from '../../common/constants';

export default function CreateInvoiceModal() {
  const form = useForm({
    initialValues: {
      senderCard: '',
      receiverUser: '',
      sum: 1,
      description: '-',
    },
    transformValues: ({ senderCard, receiverUser, ...rest }) => ({
      ...rest,
      senderCardId: +senderCard,
      receiverUserId: +receiverUser,
    }),
  });

  const { data: cards, ...cardsResponse } = useSelectMyCardsQuery();
  const { data: users, ...usersResponse } = useSelectAllUsersQuery();

  const user = users?.find((user) => user.id === +form.values.receiverUser);

  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();

  const handleSubmit = async (dto: CreateInvoiceDto) => {
    await createInvoice(dto);
  };

  return (
    <CustomForm
      onSubmit={form.onSubmit(handleSubmit)}
      isLoading={isLoading}
      text={'Create invoice'}
    >
      <Select
        label='Sender Card'
        placeholder='Sender Card'
        rightSection={<RefetchAction {...cardsResponse} />}
        itemComponent={CardsItem}
        data={selectCardsWithBalance(cards)}
        searchable
        required
        disabled={cardsResponse.isFetching}
        {...form.getInputProps('senderCard')}
      />
      <Select
        label='Receiver User'
        placeholder='Receiver User'
        icon={user && <CustomAvatar {...user} />}
        iconWidth={48}
        rightSection={<RefetchAction {...usersResponse} />}
        itemComponent={UsersItem}
        data={selectUsers(users)}
        searchable
        required
        disabled={usersResponse.isFetching}
        {...form.getInputProps('receiverUser')}
      />
      <NumberInput
        label='Sum'
        placeholder='Sum'
        required
        min={1}
        max={MAX_SUM_VALUE}
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

export const createInvoiceButton = {
  label: 'Create',
  open: () =>
    openModal({
      title: 'Create Invoice',
      children: <CreateInvoiceModal />,
    }),
};
